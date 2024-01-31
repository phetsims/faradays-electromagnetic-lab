// Copyright 2023-2024, University of Colorado Boulder

/**
 * CoilNode is the visualization of a coil of wire, with electrons flowing through the coil to represent current.
 *
 * In order to simulate objects passing "through" the coil, CoilNode consists of two layers, referred to as the
 * foreground and background. Foreground elements are children of CoilNode. Background elements are children of
 * this.backgroundNode, and it is the responsibility of the instantiator to add this.backgroundNode to the scene graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Coil from '../model/Coil.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
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
import CoilSegmentNode from './CoilSegmentNode.js';

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

  // Segments of the coil
  private readonly coilSegmentNodes: CoilSegmentNode[];

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

    this.coilSegmentNodes = [];
    this.electrons = [];
    this.electronNodes = [];

    Multilink.multilink( [ coil.coilSegmentsProperty ], coilSegments => {
      this.updateCoilSegmentNodes( coilSegments );
      this.updateElectrons( coilSegments );
    } );

    coil.addStepListener( dt => {
      if ( this.coil.electronsVisibleProperty ) {
        this.electrons.forEach( electron => electron.step( dt ) );
      }
    } );
  }

  /**
   * Creates a CoilSegmentNode for each CoilSegment that describes the coil.
   */
  private updateCoilSegmentNodes( coilSegments: CoilSegment[] ): void {

    // Delete existing CoilSegmentNode instances.
    this.coilSegmentNodes.forEach( coilSegmentNode => coilSegmentNode.dispose() );
    this.coilSegmentNodes.length = 0;

    // Create new CoilSegmentNode instances, and add to the foreground or background layer.
    coilSegments.forEach( coilSegment => {
      const coilSegmentNode = new CoilSegmentNode( coilSegment, this.coil.wireWidth );
      this.coilSegmentNodes.push( coilSegmentNode );

      const parentNode = ( coilSegment.layer === 'foreground' ) ? this.foregroundNode : this.backgroundNode;
      parentNode.addChild( coilSegmentNode );
    } );
  }

  /**
   * Updates the electrons to match the physical appearance of the coil.
   */
  private updateElectrons( coilSegments: CoilSegment[] ): void {

    // Delete existing Electron instances.
    this.electrons.forEach( electron => electron.dispose() );
    this.electrons.length = 0;

    // coilSegments is ordered from left to right. So these are the indices for the ends of the coil.
    const leftEndIndex = 0;
    const rightEndIndex = coilSegments.length - 1;

    // Add Electron and ElectronNode instances to each coil segment.
    for ( let coilSegmentIndex = 0; coilSegmentIndex < coilSegments.length; coilSegmentIndex++ ) {

      // Compute how many electrons to add to the segment. The ends of the coil have a fixed number of electrons,
      // while the other segments is a function of loop radius.
      let numberOfElectrons;
      if ( coilSegmentIndex === leftEndIndex ) {
        numberOfElectrons = Coil.ELECTRONS_IN_LEFT_END;
      }
      else if ( coilSegmentIndex === rightEndIndex ) {
        numberOfElectrons = Coil.ELECTRONS_IN_RIGHT_END;
      }
      else {
        numberOfElectrons = Math.trunc( this.coil.loopRadiusProperty.value / Coil.ELECTRON_SPACING );
      }
      assert && assert( Number.isInteger( numberOfElectrons ) && numberOfElectrons > 0,
        `invalid numberOfElectrons: ${numberOfElectrons}` );

      // Add electrons to the coil segment.
      for ( let i = 0; i < numberOfElectrons; i++ ) {

        const coilSegmentPosition = i / numberOfElectrons;

        // Model
        const electron = new Electron( this.coil.currentAmplitudeProperty, this.coil.currentAmplitudeRange, {
          coilSegments: coilSegments,
          coilSegmentIndex: coilSegmentIndex,
          coilSegmentPosition: coilSegmentPosition,
          speedScaleProperty: this.coil.electronSpeedScaleProperty
        } );
        this.electrons.push( electron );
      }
    }

    this.updateElectronNodes( this.electrons );
  }

  /**
   * Creates an ElectronNode for each Electron in the model.
   */
  private updateElectronNodes( electrons: Electron[] ): void {

    // Delete existing ElectronNode instances.
    this.electronNodes.forEach( electronNode => electronNode.dispose() );
    this.electronNodes.length = 0;

    // Create new ElectronNode instances.
    electrons.forEach( electron => {
      const electronNode = new ElectronNode( electron, this.foregroundNode, this.backgroundNode,
        this.coil.electronsVisibleProperty );
      this.electronNodes.push( electronNode );
    } );
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