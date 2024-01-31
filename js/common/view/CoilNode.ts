// Copyright 2023-2024, University of Colorado Boulder

/**
 * CoilNode is the visualization of a coil of wire. In order to simulate objects passing "through" the
 * coil, CoilNode consists of two layers, referred to as the foreground and background. Foreground elements
 * are children of CoilNode. Background elements are children of this.backgroundNode, and it is the responsibility
 * of the instantiator to add this.backgroundNode to the scene graph.
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
import { Node, NodeOptions, Path, PathOptions } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Electron from '../model/Electron.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ElectronNode from './ElectronNode.js';
import FELMovableNode, { FELMovableNodeOptions } from './FELMovableNode.js';
import FELMovable from '../model/FELMovable.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CoilSegment from '../model/CoilSegment.js';

// Space between electrons, determines the number of electrons add to each curve.
const ELECTRON_SPACING = 25;
const ELECTRONS_IN_LEFT_END = 2;
const ELECTRONS_IN_RIGHT_END = 2;

type SelfOptions = {
  isMovable?: boolean; // Whether the coil is movable.
  dragBoundsProperty?: TReadOnlyProperty<Bounds2> | null;
};

type CoilNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class CoilNode extends Node {

  // the coil associated with this Node
  private readonly coil: Coil;

  // The foreground layer, which is a child of this Node. This part of the coil is intended to be in front of
  // the B-field, magnet, etc., so that it looks like those things are passing through the coil.
  private readonly foregroundNode: Node;

  // The background layer, intended to be added to the scene graph behind the B-field, magnet, etc., so that it looks
  // like those things are passing through the coil. It is the responsibility of the instantiator to add backgroundNode
  // to the scene graph.
  public readonly backgroundNode: Node;

  // Is electron animation enabled?
  private electronAnimationEnabled: boolean;

  // Electrons in the coil
  private readonly electrons: Electron[];
  private readonly electronNodes: ElectronNode[];

  /**
   * @param coil - the coil associated with this Node
   * @param movable - the model element to move when this.backgroundNode is dragged
   * @param providedOptions
   */
  public constructor( coil: Coil, movable: FELMovable, providedOptions: CoilNodeOptions ) {

    const options = optionize<CoilNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      isMovable: true,
      dragBoundsProperty: null,

      // NodeOptions
      isDisposable: false,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    this.coil = coil;
    this.addLinkedElement( this.coil );

    this.foregroundNode = new Node();
    this.addChild( this.foregroundNode );

    this.backgroundNode = new CoilBackgroundNode( movable, {
      isMovable: options.isMovable,
      dragBoundsProperty: options.dragBoundsProperty,
      visibleProperty: this.visibleProperty
    } );

    this.electronAnimationEnabled = false;

    this.electrons = [];
    this.electronNodes = [];

    Multilink.multilink( [ coil.coilSegmentsProperty ], coilSegments => {
      this.updateCoilSegments( coilSegments );
      this.updateElectrons( coilSegments );
    } );

    coil.addStepListener( dt => {
      if ( this.coil.electronsVisibleProperty ) {
        this.electrons.forEach( electron => electron.step( dt ) );
      }
    } );
  }

  /**
   * Updates the physical appearance of the coil.
   */
  private updateCoilSegments( coilSegments: CoilSegment[] ): void {

    // Start by deleting everything.
    this.foregroundNode.removeAllChildren();
    this.backgroundNode.removeAllChildren();

    // Options shared by all segments of the coil.
    const pathOptions: PathOptions = {
      lineWidth: this.coil.wireWidth,
      lineCap: 'round',
      lineJoin: 'bevel',
      strokePickable: true
    };

    coilSegments.forEach( coilSegment => {

      // Create a Path to render the CoilSegment.
      const path = new Path( coilSegment.curve.toShape(), combineOptions<PathOptions>( {}, pathOptions, {
        stroke: coilSegment.stroke
      } ) );

      // Add the Path to the appropriate layer.
      const parentNode = ( coilSegment.layer === 'foreground' ) ? this.foregroundNode : this.backgroundNode;
      parentNode.addChild( path );
    } );
  }

  /**
   * Updates the electrons to match the physical appearance of the coil.
   */
  private updateElectrons( coilSegments: CoilSegment[] ): void {

    // Delete existing Electron and ElectronNode instances.
    this.electrons.forEach( electron => electron.dispose() );
    this.electrons.length = 0;
    this.electronNodes.forEach( electronNode => electronNode.dispose() );
    this.electronNodes.length = 0;

    // coilSegments is ordered from left to right. So these are the indices for the ends of the coil.
    const leftEndIndex = 0;
    const rightEndIndex = coilSegments.length - 1;

    // Add Electron and ElectronNode instances to each curve segment.
    for ( let coilSegmentIndex = 0; coilSegmentIndex < coilSegments.length; coilSegmentIndex++ ) {

      // Compute how many electrons to add to the curve segment. The ends of the coil have a fixed number of electrons,
      // while the other segments is a function of loop radius.
      let numberOfElectrons;
      if ( coilSegmentIndex === leftEndIndex ) {
        numberOfElectrons = ELECTRONS_IN_LEFT_END;
      }
      else if ( coilSegmentIndex === rightEndIndex ) {
        numberOfElectrons = ELECTRONS_IN_RIGHT_END;
      }
      else {
        numberOfElectrons = Math.trunc( this.coil.getLoopRadius() / ELECTRON_SPACING );
      }
      assert && assert( Number.isInteger( numberOfElectrons ) && numberOfElectrons > 0,
        `invalid numberOfElectrons: ${numberOfElectrons}` );

      // Add electrons to the curve segment.
      for ( let i = 0; i < numberOfElectrons; i++ ) {

        const coilSegmentPosition = i / numberOfElectrons;

        // Model
        const electron = new Electron( this.coil.currentAmplitudeProperty, this.coil.currentAmplitudeRange, {
          coilSegments: coilSegments,
          coilSegmentIndex: coilSegmentIndex,
          coilSegmentPosition: coilSegmentPosition,
          speedScaleProperty: this.coil.electronSpeedScaleProperty,
          visibleProperty: this.coil.electronsVisibleProperty
        } );
        this.electrons.push( electron );

        // View
        const electronNode = new ElectronNode( electron, this.foregroundNode, this.backgroundNode );
        this.electronNodes.push( electronNode );
      }
    }
    assert && assert( this.electrons.length === this.electronNodes.length );
  }
}

/**
 * CoilBackgroundNode is the background layer of CoilNode. It is not a child of CoilNode, and must be added to
 * the scene graph separately. See documentation for CoilNode backgroundNode.
 */
type CoilBackgroundNodeOptions = PickRequired<FELMovableNodeOptions, 'isMovable' | 'dragBoundsProperty' | 'visibleProperty'>;

class CoilBackgroundNode extends FELMovableNode {

  /**
   * @param movable - the model element to move when the background layer is dragged
   * @param providedOptions
   */
  public constructor( movable: FELMovable, providedOptions: CoilBackgroundNodeOptions ) {
    super( movable, combineOptions<FELMovableNodeOptions>( {
      hasKeyboardDragListener: false, // It is sufficient to have alt input for the foreground layer of CoilNode.
      tandem: Tandem.OPT_OUT // There is no need to instrument the background layer of CoilNode.
    }, providedOptions ) );
  }
}

faradaysElectromagneticLab.register( 'CoilNode', CoilNode );