// Copyright 2023-2024, University of Colorado Boulder

//TODO Move electrons and coilSegments to the Coil model, remove stepEmitter

/**
 * CoilNode is the visualization of a coil of wire. In order to simulate objects passing "through" the
 * coil, CoilNode consists of two layers, referred to as the foreground and background. Foreground elements
 * are children of CoilNode. Background elements are children of this.backgroundNode, and it is the responsibility
 * of the instantiator to add this.backgroundNode to the scenegraph.
 *
 * The coil is drawn as a set of curves, with a "wire end" attached at each end of the coil. The wire ends is where
 * things can be connected to the coil (eg, a lightbulb or voltmeter).
 *
 * The coil is also responsible for showing the flow of electrons. The number of electrons is a function of the
 * loop radius and number of loops. An array of CoilSegment describes the coil's path, and contains the information
 * that the electrons need to flow through the coil, move between layers (foreground or background), and how to
 * adjust ("scale") their speed so that they appear to flow at the same rate in all curve segments. For example,
 * the wire ends are significantly shorter curves that the other segments in the coil.
 *
 * WARNING! The updateCoil method in particular is very complicated, and the curves that it creates have been tuned
 * so that all curve segments are smoothly joined to form a 3D-looking coil. If you change values, do so with caution,
 * test frequently, and perform a close visual inspection of your changes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Coil from '../model/Coil.js';
import { LinearGradient, Node, NodeOptions, Path, PathOptions } from '../../../../scenery/js/imports.js';
import CoilSegment, { CoilSegmentOptions } from '../model/CoilSegment.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import Electron from '../model/Electron.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ElectronNode from './ElectronNode.js';
import QuadraticBezierSpline from '../model/QuadraticBezierSpline.js';
import FELColors from '../FELColors.js';
import Emitter from '../../../../axon/js/Emitter.js';
import FELMovableNode from './FELMovableNode.js';

// Space between electrons, determines the number of electrons add to each curve.
const ELECTRON_SPACING = 25;
const ELECTRONS_IN_LEFT_END = 2;
const ELECTRONS_IN_RIGHT_END = 2;

type SelfOptions = {
  endsConnected?: boolean; // Whether to connect the ends of the coil.
  isMovable?: boolean; // Whether the coil is movable.
};

type CoilNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class CoilNode extends Node {

  private readonly coil: Coil;

  // The parent of Nodes that are background elements, intended to be added to the scenegraph behind the B-field, magnet,
  // and compass, so that it looks like those things are passing through the coil. It is the responsibility of the
  // instantiator to add backgroundNode to the scenegraph. Foreground elements are children of CoilNode.
  public readonly backgroundNode: Node;

  // Is electron animation enabled?
  private electronAnimationEnabled: boolean;

  // Ordered collection of the curves that make up the coil
  private readonly coilSegments: CoilSegment[];

  // Electrons in the coil
  private readonly electrons: Electron[]; //TODO PhetioGroup or allocate a static pool
  private readonly electronNodes: ElectronNode[];

  // Whether to connect the ends of the coil.
  public readonly endsConnected: boolean;

  public constructor( coil: Coil, stepEmitter: Emitter<[ number ]>, providedOptions: CoilNodeOptions ) {

    const options = optionize<CoilNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      endsConnected: false,
      isMovable: true,

      // NodeOptions
      isDisposable: false,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    this.coil = coil;
    this.addLinkedElement( this.coil );

    // This is an FELMovableNode so that the coil can also be dragged via this.backgroundNode.
    this.backgroundNode = new FELMovableNode( coil, {
      hasKeyboardDragListener: false,
      visibleProperty: this.visibleProperty,
      tandem: Tandem.OPT_OUT,
      isMovable: options.isMovable
    } );

    this.electronAnimationEnabled = false;

    this.coilSegments = [];
    this.electrons = [];
    this.electronNodes = [];
    this.endsConnected = options.endsConnected;

    Multilink.multilink( [ coil.numberOfLoopsProperty, coil.loopAreaProperty ], () => this.updateCoil() );

    this.coil.currentAmplitudeProperty.link( () => this.updateElectronsSpeedAndDirection() );

    stepEmitter.addListener( dt => this.step( dt ) );
  }

  private step( dt: number ): void {
    assert && assert( dt === 1, `invalid dt=${dt}, see FELModel step` );
    this.electrons.forEach( electron => electron.step( dt ) );
  }

  /**
   * Updates the physical appearance of the coil and the number of electrons.
   */
  private updateCoil(): void {

    // Start by deleting everything.
    this.removeAllChildren();
    this.backgroundNode.removeAllChildren();
    this.coilSegments.length = 0;
    this.electrons.forEach( electron => electron.dispose() );
    this.electrons.length = 0;
    this.electronNodes.forEach( electronNode => electronNode.dispose() );
    this.electronNodes.length = 0;

    // Get some coil model values, to improve code readability.
    const radius = this.coil.getLoopRadius();
    const numberOfLoops = this.coil.numberOfLoopsProperty.value;
    const loopSpacing = this.coil.loopSpacing;

    // Start at the left-most loop, keeping the coil centered.
    const xStart = -( loopSpacing * ( numberOfLoops - 1 ) / 2 );

    // Positions of the left and right ends of the coil.
    let leftEndPoint: Vector2 | null = null;
    let rightEndPoint: Vector2 | null = null;

    const pathOptions: PathOptions = {
      lineWidth: this.coil.wireWidth,
      lineCap: 'round',
      lineJoin: 'bevel',
      strokePickable: true
    };

    // Create the wire ends & loops from left to right.
    // Curves are created in the order that they are pieced together.
    for ( let i = 0; i < numberOfLoops; i++ ) {

      const xOffset = xStart + ( i * loopSpacing );

      // For the left-most loop...
      if ( i === 0 ) {

        // Left wire end in background
        {
          const endPoint = new Vector2( -loopSpacing / 2 + xOffset, -radius ); // lower
          const startPoint = new Vector2( endPoint.x - 15, endPoint.y - 40 ); // upper
          const controlPoint = new Vector2( endPoint.x - 20, endPoint.y - 20 );
          const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

          // Horizontal gradient, left to right.
          const gradient = new LinearGradient( startPoint.x, 0, endPoint.x, 0 )
            .addColorStop( 0, FELColors.coilMiddleColorProperty )
            .addColorStop( 1, FELColors.coilBackColorProperty );

          // Scale the speed, since this curve is different from the others in the coil.
          const speedScale = ( radius / ELECTRON_SPACING ) / ELECTRONS_IN_LEFT_END;
          const coilSegment = new CoilSegment( curve, this.backgroundNode, combineOptions<CoilSegmentOptions>( {
            speedScale: speedScale,
            stroke: gradient
          }, pathOptions ) );
          this.coilSegments.push( coilSegment );
          coilSegment.parentNode.addChild( coilSegment );

          leftEndPoint = startPoint;
        }

        // Back top (left-most) is slightly different, because it connects to the left wire end.
        {
          const startPoint = new Vector2( -loopSpacing / 2 + xOffset, -radius ); // upper
          const endPoint = new Vector2( ( radius * 0.25 ) + xOffset, 0 ); // lower
          const controlPoint = new Vector2( ( radius * 0.15 ) + xOffset, ( -radius * 0.70 ) );
          const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

          const coilSegment = new CoilSegment( curve, this.backgroundNode, combineOptions<CoilSegmentOptions>( {
            stroke: FELColors.coilBackColorProperty
          }, pathOptions ) );
          this.coilSegments.push( coilSegment );
          coilSegment.parentNode.addChild( coilSegment );
        }
      }
      else {

        // Back top (no wire end connection)
        const startPoint = new Vector2( -loopSpacing + xOffset, -radius ); // upper
        const endPoint = new Vector2( ( radius * 0.25 ) + xOffset, 0 ); // lower
        const controlPoint = new Vector2( ( radius * 0.15 ) + xOffset, ( -radius * 1.20 ) );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        // Diagonal gradient, upper left to lower right.
        const gradient = new LinearGradient( startPoint.x + ( radius * 0.10 ), -radius, xOffset, -radius * 0.92 )
          .addColorStop( 0, FELColors.coilMiddleColorProperty )
          .addColorStop( 1, FELColors.coilBackColorProperty );

        const coilSegment = new CoilSegment( curve, this.backgroundNode, combineOptions<CoilSegmentOptions>( {
          stroke: gradient
        }, pathOptions ) );
        this.coilSegments.push( coilSegment );
        coilSegment.parentNode.addChild( coilSegment );
      }

      // Back bottom
      {
        const startPoint = new Vector2( ( radius * 0.25 ) + xOffset, 0 ); // upper
        const endPoint = new Vector2( xOffset, radius ); // lower
        const controlPoint = new Vector2( ( radius * 0.35 ) + xOffset, ( radius * 1.20 ) );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        // Vertical gradient, upper to lower
        const gradient = new LinearGradient( 0, radius * 0.92, 0, radius )
          .addColorStop( 0, FELColors.coilBackColorProperty )
          .addColorStop( 1, FELColors.coilMiddleColorProperty );

        const coilSegment = new CoilSegment( curve, this.backgroundNode, combineOptions<CoilSegmentOptions>( {
          stroke: gradient
        }, pathOptions ) );
        this.coilSegments.push( coilSegment );
        coilSegment.parentNode.addChild( coilSegment );
      }

      // Horizontal gradient, left to right, for the front segments
      const frontGradient = new LinearGradient( ( -radius * 0.25 ) + xOffset, 0, -radius * 0.15 + xOffset, 0 )
        .addColorStop( 0, FELColors.coilFrontColorProperty )
        .addColorStop( 1, FELColors.coilMiddleColorProperty );

      // Front bottom
      {
        const startPoint = new Vector2( xOffset, radius ); // lower
        const endPoint = new Vector2( ( -radius * 0.25 ) + xOffset, 0 ); // upper
        const controlPoint = new Vector2( ( -radius * 0.25 ) + xOffset, ( radius * 0.80 ) );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        const coilSegment = new CoilSegment( curve, this, combineOptions<CoilSegmentOptions>( {
          stroke: frontGradient
        }, pathOptions ) );
        this.coilSegments.push( coilSegment );
        coilSegment.parentNode.addChild( coilSegment );
      }

      // Front top
      {
        const startPoint = new Vector2( ( -radius * 0.25 ) + xOffset, 0 ); // lower
        const endPoint = new Vector2( xOffset, -radius ); // upper
        const controlPoint = new Vector2( ( -radius * 0.25 ) + xOffset, ( -radius * 0.80 ) );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        const coilSegment = new CoilSegment( curve, this, combineOptions<CoilSegmentOptions>( {
          lineWidth: this.coil.wireWidth,
          stroke: frontGradient
        }, pathOptions ) );
        this.coilSegments.push( coilSegment );
        coilSegment.parentNode.addChild( coilSegment );
      }

      // For the rightmost loop.... Right wire end in foreground
      if ( i === numberOfLoops - 1 ) {
        const startPoint = new Vector2( xOffset, -radius ); // lower
        const endPoint = new Vector2( startPoint.x + 15, startPoint.y - 40 ); // upper
        const controlPoint = new Vector2( startPoint.x + 20, startPoint.y - 20 );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        // Scale the speed, since this curve is different from the others in the coil.
        const speedScale = ( radius / ELECTRON_SPACING ) / ELECTRONS_IN_RIGHT_END;
        const coilSegment = new CoilSegment( curve, this, combineOptions<CoilSegmentOptions>( {
          speedScale: speedScale,
          stroke: FELColors.coilMiddleColorProperty
        }, pathOptions ) );
        this.coilSegments.push( coilSegment );
        coilSegment.parentNode.addChild( coilSegment );

        rightEndPoint = endPoint;
      }
    }

    // Connect the ends
    if ( this.endsConnected ) {
      assert && assert( leftEndPoint && rightEndPoint );
      const shape = new Shape().moveTo( leftEndPoint!.x, leftEndPoint!.y ).lineTo( rightEndPoint!.x, rightEndPoint!.y );
      const path = new Path( shape, combineOptions<PathOptions>( {
        stroke: FELColors.coilMiddleColorProperty
      }, pathOptions ) );
      this.addChild( path );
    }

    // Add electrons to the coil.
    {
      const speedAndDirection = this.calculateElectronSpeedAndDirection();

      const leftEndIndex = 0;
      const rightEndIndex = this.coilSegments.length - 1;

      // For each curve...
      for ( let coilSegmentIndex = 0; coilSegmentIndex < this.coilSegments.length; coilSegmentIndex++ ) {

        // The wire ends are a different size, and therefore contain a different number of electrons.
        let numberOfElectrons;
        if ( coilSegmentIndex === leftEndIndex ) {
          numberOfElectrons = ELECTRONS_IN_LEFT_END;
        }
        else if ( coilSegmentIndex === rightEndIndex ) {
          numberOfElectrons = ELECTRONS_IN_RIGHT_END;
        }
        else {
          numberOfElectrons = Math.trunc( radius / ELECTRON_SPACING );
        }
        assert && assert( Number.isInteger( numberOfElectrons ) && numberOfElectrons > 0,
          `invalid numberOfElectrons: ${numberOfElectrons}` );

        // Add the electrons to the curve.
        for ( let i = 0; i < numberOfElectrons; i++ ) {

          const coilSegmentPosition = i / numberOfElectrons;

          // Model
          const electron = new Electron( {
            coilSegments: this.coilSegments,
            coilSegmentIndex: coilSegmentIndex,
            coilSegmentPosition: coilSegmentPosition,
            speedAndDirection: speedAndDirection,
            speedScaleProperty: this.coil.electronSpeedScaleProperty,
            visibleProperty: this.coil.electronsVisibleProperty,
            tandem: Tandem.OPT_OUT //TODO dynamic element
          } );
          this.electrons.push( electron );

          // View
          const electronNode = new ElectronNode( electron );
          this.electronNodes.push( electronNode );
        }
      }
      assert && assert( this.electrons.length === this.electronNodes.length );
    }
  }

  /**
   * Updates the speed and direction of electrons in the coil.
   */
  private updateElectronsSpeedAndDirection(): void {

    // Speed and direction is a function of the voltage.
    const speedAndDirection = this.calculateElectronSpeedAndDirection();

    // Update all electrons.
    const numberOfElectrons = this.electrons.length;
    for ( let i = 0; i < numberOfElectrons; i++ ) {
      this.electrons[ i ].speedAndDirectionProperty.value = speedAndDirection;
    }
  }

  /**
   * Calculates the speed and direction of electrons.
   * The value is in the range [-1,1].
   * Direction is indicated by the sign of the value.
   * Magnitude of 0 indicates no motion.
   * Magnitude of 1 moves along an entire curve segment in one clock tick.
   * Current below the threshold is effectively zero.
   */
  private calculateElectronSpeedAndDirection(): number {
    const currentAmplitude = this.coil.currentAmplitudeProperty.value;
    return ( Math.abs( currentAmplitude ) < FELConstants.CURRENT_AMPLITUDE_THRESHOLD ) ? 0 : currentAmplitude;
  }
}

faradaysElectromagneticLab.register( 'CoilNode', CoilNode );