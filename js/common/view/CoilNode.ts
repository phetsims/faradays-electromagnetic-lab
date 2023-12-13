// Copyright 2023, University of Colorado Boulder

//TODO This doc was copied from CoilGraphic.java. Verify that it's still accurate.
/**
 * CoilGraphic is the graphical representation of a coil of wire. In order to simulate objects passing "through" the
 * coil, the coil graphic consists of two layers, called the "foreground" and "background".
 *
 * The coil is drawn as a set of curves, with a "wire end" joined at each end of the coil. The wire ends is where
 * things can be connected to the coil (eg, a lightbulb or voltmeter).
 *
 * The coil optionally shows electrons flowing. The number of electrons is a function of the coil radius and number of
 * loops. Electrons are part of the simulation model, and they know about the path that they need to follow. The path
 * is a describe by a set of ElectronPathDescriptors.
 *
 * The set of ElectronPathDescriptors contains the information that the electrons need to determine which layer that
 * are in (foreground or background) and how to adjust ("scale") their speed so that they appear to flow at the same
 * rate in all curve segments. For example, the wire ends are significantly shorter curves that the other segments
 * in the coil.
 *
 * WARNING!  The updateCoil method in particular is very complicated, and the curves that it creates have been tuned
 * so that all curve segments are smoothly joined to form a 3D-looking coil. If you change values, do so with caution,
 * test frequently, and perform a close visual inspection of your changes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Coil from '../model/Coil.js';
import { LinearGradient, Node, NodeOptions, Path, PathOptions } from '../../../../scenery/js/imports.js';
import CoilSegment from '../model/CoilSegment.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import Electron from '../model/Electron.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ElectronNode from './ElectronNode.js';
import QuadraticBezierSpline from '../model/QuadraticBezierSpline.js';
import FELColors from '../FELColors.js';

// Space between electrons, determines the number of electrons add to each curve.
const ELECTRON_SPACING = 25;
const ELECTRONS_IN_LEFT_END = 2;
const ELECTRONS_IN_RIGHT_END = 2;

type SelfOptions = {
  endsConnected?: boolean; // Whether to connect the ends of the coil.
};

type CoilNodeOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

//TODO This is not a Node. It creates foregroundNode and backgroundNode, between which electrons move.
export default class CoilNode extends PhetioObject {

  private readonly coil: Coil;
  public readonly foregroundNode: Node;
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

  public constructor( coil: Coil, providedOptions: CoilNodeOptions ) {

    const options = optionize<CoilNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      endsConnected: false,

      // NodeOptions
      isDisposable: false
    }, providedOptions );

    super( options );

    this.coil = coil;

    this.foregroundNode = new Node();
    this.backgroundNode = new Node();

    this.electronAnimationEnabled = false;

    this.coilSegments = [];
    this.electrons = [];
    this.electronNodes = [];
    this.endsConnected = options.endsConnected;

    Multilink.multilink( [ coil.numberOfLoopsProperty, coil.loopRadiusProperty ], () => this.updateCoil() );
  }

  /**
   * Updates the physical appearance of the coil.
   */
  private updateCoil(): void {

    // Start by deleting everything.
    this.foregroundNode.removeAllChildren();
    this.backgroundNode.removeAllChildren();
    this.coilSegments.length = 0;
    this.electrons.forEach( electron => electron.dispose() );
    this.electrons.length = 0;
    this.electronNodes.forEach( electronNode => electronNode.dispose() );
    this.electronNodes.length = 0;

    // Get some coil model values, to improve code readability.
    const radius = this.coil.loopRadiusProperty.value;
    const numberOfLoops = this.coil.numberOfLoopsProperty.value;
    const loopSpacing = this.coil.loopSpacing;

    // Start at the left-most loop, keeping the coil centered.
    const xStart = -( loopSpacing * ( numberOfLoops - 1 ) / 2 );

    let leftEndPoint: Vector2 | null = null;
    let rightEndPoint: Vector2 | null = null;

    const pathOptions: PathOptions = {
      lineWidth: this.coil.wireWidth,
      lineCap: 'round',
      lineJoin: 'bevel'
    };

    // Create the wire ends & loops from left to right.
    // Curves are created in the order that they are pieced together.
    for ( let i = 0; i < numberOfLoops; i++ ) {

      const xOffset = xStart + ( i * loopSpacing );

      if ( i === 0 ) {

        // Left wire end in background
        {
          const endPoint = new Vector2( -loopSpacing / 2 + xOffset, -radius ); // lower
          const startPoint = new Vector2( endPoint.x - 15, endPoint.y - 40 ); // upper
          const controlPoint = new Vector2( endPoint.x - 20, endPoint.y - 20 );
          const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

          // Scale the speed, since this curve is different than the others in the coil.
          const speedScale = ( radius / ELECTRON_SPACING ) / ELECTRONS_IN_LEFT_END;
          const descriptor = new CoilSegment( curve, this.backgroundNode, speedScale );
          this.coilSegments.push( descriptor );

          // Horizontal gradient, left to right.
          const gradient = new LinearGradient( startPoint.x, 0, endPoint.x, 0 )
            .addColorStop( 0, FELColors.coilMiddleColorProperty )
            .addColorStop( 1, FELColors.coilBackColorProperty );

          const shape = new Shape()
            .moveToPoint( curve.startPoint )
            .quadraticCurveToPoint( curve.controlPoint, curve.endPoint );
          const path = new Path( shape, combineOptions<PathOptions>( { stroke: gradient }, pathOptions ) );
          this.backgroundNode.addChild( path );

          leftEndPoint = startPoint;
        }

        // Back top (left-most) is slightly different, because it connects to the left wire end.
        {
          const startPoint = new Vector2( -loopSpacing / 2 + xOffset, -radius ); // upper
          const endPoint = new Vector2( ( radius * 0.25 ) + xOffset, 0 ); // lower
          const controlPoint = new Vector2( ( radius * 0.15 ) + xOffset, ( -radius * 0.70 ) );
          const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

          const descriptor = new CoilSegment( curve, this.backgroundNode );
          this.coilSegments.push( descriptor );

          const shape = new Shape()
            .moveToPoint( curve.startPoint )
            .quadraticCurveToPoint( curve.controlPoint, curve.endPoint );
          const path = new Path( shape, combineOptions<PathOptions>( {
            stroke: FELColors.coilBackColorProperty
          }, pathOptions ) );
          this.backgroundNode.addChild( path );
        }
      }
      else {

        // Back top (no wire end connection)
        const startPoint = new Vector2( -loopSpacing + xOffset, -radius ); // upper
        const endPoint = new Vector2( ( radius * 0.25 ) + xOffset, 0 ); // lower
        const controlPoint = new Vector2( ( radius * 0.15 ) + xOffset, ( -radius * 1.20 ) );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        const descriptor = new CoilSegment( curve, this.backgroundNode );
        this.coilSegments.push( descriptor );

        // Diagonal gradient, upper left to lower right.
        const gradient = new LinearGradient( startPoint.x + ( radius * 0.10 ), -radius, xOffset, -radius * 0.92 )
          .addColorStop( 0, FELColors.coilMiddleColorProperty )
          .addColorStop( 1, FELColors.coilBackColorProperty );

        const shape = new Shape()
          .moveToPoint( curve.startPoint )
          .quadraticCurveToPoint( curve.controlPoint, curve.endPoint );
        const path = new Path( shape, combineOptions<PathOptions>( { stroke: gradient }, pathOptions ) );
        this.backgroundNode.addChild( path );
      }

      // Back bottom
      {
        const startPoint = new Vector2( ( radius * 0.25 ) + xOffset, 0 ); // upper
        const endPoint = new Vector2( xOffset, radius ); // lower
        const controlPoint = new Vector2( ( radius * 0.35 ) + xOffset, ( radius * 1.20 ) );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        const descriptor = new CoilSegment( curve, this.backgroundNode );
        this.coilSegments.push( descriptor );

        // Vertical gradient, upper to lower
        const gradient = new LinearGradient( 0, radius * 0.92, 0, radius )
          .addColorStop( 0, FELColors.coilBackColorProperty )
          .addColorStop( 1, FELColors.coilMiddleColorProperty );

        const shape = new Shape()
          .moveToPoint( curve.startPoint )
          .quadraticCurveToPoint( curve.controlPoint, curve.endPoint );
        const path = new Path( shape, combineOptions<PathOptions>( { stroke: gradient }, pathOptions ) );
        this.backgroundNode.addChild( path );
      }

      // Front bottom
      {
        const startPoint = new Vector2( xOffset, radius ); // lower
        const endPoint = new Vector2( ( -radius * 0.25 ) + xOffset, 0 ); // upper
        const controlPoint = new Vector2( ( -radius * 0.25 ) + xOffset, ( radius * 0.80 ) );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        const d = new CoilSegment( curve, this.foregroundNode );
        this.coilSegments.push( d );

        // Horizontal gradient, left to right
        const gradient = new LinearGradient( ( -radius * 0.25 ) + xOffset, 0, -radius * 0.15 + xOffset, 0 )
          .addColorStop( 0, FELColors.coilFrontColorProperty )
          .addColorStop( 1, FELColors.coilMiddleColorProperty );

        const shape = new Shape()
          .moveToPoint( curve.startPoint )
          .quadraticCurveToPoint( curve.controlPoint, curve.endPoint );
        const path = new Path( shape, combineOptions<PathOptions>( { stroke: gradient }, pathOptions ) );
        this.foregroundNode.addChild( path );
      }

      // Front top
      {
        const startPoint = new Vector2( ( -radius * 0.25 ) + xOffset, 0 ); // lower
        const endPoint = new Vector2( xOffset, -radius ); // upper
        const controlPoint = new Vector2( ( -radius * 0.25 ) + xOffset, ( -radius * 0.80 ) );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        const descriptor = new CoilSegment( curve, this.foregroundNode );
        this.coilSegments.push( descriptor );

        // Horizontal gradient, left to right
        const gradient = new LinearGradient( ( -radius * 0.25 ) + xOffset, 0, -radius * 0.15 + xOffset, 0 )
          .addColorStop( 0, FELColors.coilFrontColorProperty )
          .addColorStop( 1, FELColors.coilMiddleColorProperty );

        const shape = new Shape()
          .moveToPoint( curve.startPoint )
          .quadraticCurveToPoint( curve.controlPoint, curve.endPoint );
        const path = new Path( shape, combineOptions<PathOptions>( { stroke: gradient }, pathOptions ) );
        this.foregroundNode.addChild( path );
      }

      // Right wire end in foreground
      if ( i === numberOfLoops - 1 ) {
        const startPoint = new Vector2( xOffset, -radius ); // lower
        const endPoint = new Vector2( startPoint.x + 15, startPoint.y - 40 ); // upper
        const controlPoint = new Vector2( startPoint.x + 20, startPoint.y - 20 );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        // Scale the speed, since this curve is different from the others in the coil.
        const speedScale = ( radius / ELECTRON_SPACING ) / ELECTRONS_IN_RIGHT_END;
        const descriptor = new CoilSegment( curve, this.foregroundNode, speedScale );
        this.coilSegments.push( descriptor );

        const shape = new Shape()
          .moveToPoint( curve.startPoint )
          .quadraticCurveToPoint( curve.controlPoint, curve.endPoint );
        const path = new Path( shape, combineOptions<PathOptions>( {
          stroke: FELColors.coilMiddleColorProperty
        }, pathOptions ) );
        this.foregroundNode.addChild( path );

        rightEndPoint = endPoint;
      }
    }

    // Connect the ends
    if ( this.endsConnected ) {
      assert && assert( leftEndPoint && rightEndPoint );
      const shape = new Shape().moveTo( leftEndPoint!.x, leftEndPoint!.y ).lineTo( rightEndPoint!.x, rightEndPoint!.y );
      const path = new Path( shape, {
        stroke: FELColors.coilMiddleColorProperty,
        lineWidth: this.coil.wireWidth,
        lineCap: 'round',
        lineJoin: 'bevel'
      } );
      this.foregroundNode.addChild( path );
    }

    // Add electrons to the coil.
    {
      const speedAndDirection = this.calculateElectronSpeedAndDirection();

      const leftEndIndex = 0;
      const rightEndIndex = this.coilSegments.length - 1;

      // For each curve...
      for ( let pathIndex = 0; pathIndex < this.coilSegments.length; pathIndex++ ) {

        // The wire ends are a different size, and therefore contain a different number of electrons.
        let numberOfElectrons;
        if ( pathIndex === leftEndIndex ) {
          numberOfElectrons = ELECTRONS_IN_LEFT_END;
        }
        else if ( pathIndex === rightEndIndex ) {
          numberOfElectrons = ELECTRONS_IN_RIGHT_END;
        }
        else {
          numberOfElectrons = Math.trunc( radius / ELECTRON_SPACING );
        }
        assert && assert( Number.isInteger( numberOfElectrons ) && numberOfElectrons > 0,
          `invalid numberOfElectrons: ${numberOfElectrons}` );

        // Add the electrons to the curve.
        for ( let i = 0; i < numberOfElectrons; i++ ) {

          const pathPosition = i / numberOfElectrons;

          // Model
          const electron = new Electron( {
            coilSegments: this.coilSegments,
            pathPosition: pathPosition,
            pathIndex: i,
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
    }
  }

  /**
   * Updates the speed and direction of electrons in the coil.
   */
  private updateElectrons(): void {

    // Speed and direction is a function of the voltage.
    const speedAndDirection = this.calculateElectronSpeedAndDirection();

    // Update all electrons.
    const numberOfElectrons = this.electrons.length;
    for ( let i = 0; i < numberOfElectrons; i++ ) {
      this.electrons[ i ].speedAndDirectionProperty.value = speedAndDirection;
    }
  }

  /**
   * Calculates the speed and direction of electrons, a function of the voltage across the coil.
   * The value is in the range [-1,1].
   * Direction is indicated by the sign of the value.
   * Magnitude of 0 indicates no motion.
   * Magnitude of 1 moves along an entire curve segment in one clock tick.
   */
  private calculateElectronSpeedAndDirection(): number {
    let currentAmplitude = this.coil.currentAmplitudeProperty.value;

    // Current below the threshold is effectively zero.
    if ( Math.abs( currentAmplitude ) < FELConstants.CURRENT_AMPLITUDE_THRESHOLD ) {
      currentAmplitude = 0;
    }

    assert && assert( Math.abs( currentAmplitude ) <= 1, `invalid currentAmplitude: ${currentAmplitude}` );
    return currentAmplitude;
  }
}

faradaysElectromagneticLab.register( 'CoilNode', CoilNode );