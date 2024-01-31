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

  // Children of foregroundNode, to maintain rendering order of coil segments and electrons.
  private readonly foregroundCoilSegmentsParent: Node;
  private readonly foregroundElectronsParent: Node;

  // The background layer, intended to be added to the scene graph behind the B-field, magnet, etc., so that it looks
  // like those things are passing through the coil. It is the responsibility of the instantiator to add backgroundNode
  // to the scene graph.
  public readonly backgroundNode: Node;

  // Children of backgroundNode, to maintain rendering order of coil segments and electrons.
  private readonly backgroundCoilSegmentsParent: Node;
  private readonly backgroundElectronsParent: Node;

  // Segments of the coil
  private readonly coilSegmentNodes: CoilSegmentNode[];

  // Electrons in the coil
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

    // Foreground layer, with coil segments behind electrons
    this.foregroundCoilSegmentsParent = new Node();
    this.foregroundElectronsParent = new Node();
    this.foregroundNode = new Node( {
      children: [ this.foregroundCoilSegmentsParent, this.foregroundElectronsParent ]
    } );
    this.addChild( this.foregroundNode );

    // Background layer, with coil segments behind electrons
    this.backgroundCoilSegmentsParent = new Node();
    this.backgroundElectronsParent = new Node();
    this.backgroundNode = new CoilBackgroundNode( movable, {
      children: [ this.backgroundCoilSegmentsParent, this.backgroundElectronsParent ],
      isMovable: options.isMovable,
      dragBoundsProperty: options.dragBoundsProperty,
      visibleProperty: this.visibleProperty
    } );

    // Render the segments that make up the coil's wire.
    this.coilSegmentNodes = [];
    coil.coilSegmentsProperty.link( coilSegments => this.updateCoilSegmentNodes( coilSegments ) );

    // Render the electrons that move through the coil.
    this.electronNodes = [];
    coil.electronsProperty.link( electrons => this.updateElectronNodes( electrons ) );
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

      const parentNode = ( coilSegment.layer === 'foreground' ) ? this.foregroundCoilSegmentsParent : this.backgroundElectronsParent;
      parentNode.addChild( coilSegmentNode );
      coilSegmentNode.moveToBack();
    } );
  }

  /**
   * Creates an ElectronNode for each Electron in the model.
   */
  private updateElectronNodes( electrons: Electron[] ): void {

    // Delete existing ElectronNode instances.
    this.electronNodes.forEach( electronNode => electronNode.dispose() );
    this.electronNodes.length = 0;

    // Create new ElectronNode instances. ElectronNode adds itself to foreground or background layer, and moves between
    // foreground and background layers as the Electron moves through the coil.
    electrons.forEach( electron => {
      const electronNode = new ElectronNode( electron, this.foregroundElectronsParent, this.backgroundElectronsParent,
        this.coil.electronsVisibleProperty );
      this.electronNodes.push( electronNode );
    } );
  }
}

/**
 * CoilBackgroundNode is the background layer of CoilNode, a subclass of FELMovableNode so that it is possible to
 * drag the coil by its background layer. It is not a child of CoilNode, and must be added to the scene graph
 * separately. See documentation for CoilNode backgroundNode.
 */
type CoilBackgroundNodeOptions = PickRequired<FELMovableNodeOptions, 'children' | 'isMovable' | 'dragBoundsProperty' | 'visibleProperty'>;

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