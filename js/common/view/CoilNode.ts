// Copyright 2023-2025, University of Colorado Boulder

/**
 * CoilNode is the visualization of a coil of wire, with current flowing through the coil. The current is represented
 * as either electrons or imaginary positive charges, depending on the current convention that is selected in
 * Preferences.
 *
 * In order to simulate objects passing "through" the coil, CoilNode consists of two layers, referred to as the
 * foreground and background. Foreground elements are children of CoilNode. Background elements are children of
 * this.backgroundNode, and it is the responsibility of the instantiator to add this.backgroundNode to the scene graph.
 *
 * This is based on CoilGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import platform from '../../../../phet-core/js/platform.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Coil from '../model/Coil.js';
import CoilSegment from '../model/CoilSegment.js';
import CoilSegmentNode from './CoilSegmentNode.js';
import CurrentNode from './CurrentNode.js';
import FELMovableNode, { FELMovableNodeOptions } from './FELMovableNode.js';

type SelfOptions = {
  isMovable?: boolean; // Whether the coil is movable.
  dragBoundsProperty?: TReadOnlyProperty<Bounds2> | null;

  // Whether to render current. This was added because CurrentNode uses scenery Sprites, which uses WebGL.
  // If we use WebGL for creating screen icons, we apparently created too many WebGL contexts, and the sim fails
  // at startup. So set this to false when creating screen icons.
  // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/109.
  renderCurrent?: boolean;
};

type CoilNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class CoilNode extends Node {

  // the coil associated with this Node
  private readonly coil: Coil;

  // The foreground layer, which is a child of this Node. This part of the coil is intended to be in front of
  // the B-field, magnet, etc., so that it looks like those things are passing through the coil.
  private readonly foregroundNode: Node;

  // Children of foregroundNode, to maintain rendering order of coil segments and charges.
  private readonly foregroundCoilSegmentsParent: Node;

  // The background layer, intended to be added to the scene graph behind the B-field, magnet, etc., so that it looks
  // like those things are passing through the coil. It is the responsibility of the instantiator to add backgroundNode
  // to the scene graph.
  public readonly backgroundNode: FELMovableNode;

  // Children of backgroundNode, to maintain rendering order of coil segments and charges.
  private readonly backgroundCoilSegmentsParent: Node;

  // Segments of the coil
  private readonly coilSegmentNodes: CoilSegmentNode[];

  /**
   * @param coil - the coil associated with this Node
   * @param positionProperty - position to adjust when this.backgroundNode is dragged
   * @param providedOptions
   */
  public constructor( coil: Coil, positionProperty: Property<Vector2>, providedOptions: CoilNodeOptions ) {

    const options = optionize<CoilNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      isMovable: true,
      dragBoundsProperty: null,
      renderCurrent: true,

      // NodeOptions
      isDisposable: false,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    this.coil = coil;
    this.addLinkedElement( this.coil );

    // Foreground layer
    this.foregroundCoilSegmentsParent = new Node();
    this.foregroundNode = new Node( {
      children: [ this.foregroundCoilSegmentsParent ]
    } );
    this.addChild( this.foregroundNode );

    // Background layer
    this.backgroundCoilSegmentsParent = new Node();
    this.backgroundNode = new CoilBackgroundNode( positionProperty, {
      children: [ this.backgroundCoilSegmentsParent ],
      isMovable: options.isMovable,
      dragBoundsProperty: options.dragBoundsProperty,
      visibleProperty: this.visibleProperty
    } );

    // Workaround for ugly artifacts caused by backgroundCoilSegmentsParent with Safari on macOS, iOS, and iPadOS.
    // transparentRectangleNode must be in the same layer as backgroundNode.
    // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/172
    if ( platform.safari ) {
      const transparentRectangleNode = new Rectangle( 0, 0, 1, 1, {
        fill: 'transparent',
        pickable: false,
        localBounds: new Bounds2( 0, 0, 1, 1 ) // so that this does not affect the bounds of focusHighlight
      } );
      this.backgroundNode.addChild( transparentRectangleNode );
      this.backgroundCoilSegmentsParent.localBoundsProperty.lazyLink( localBounds => {
        transparentRectangleNode.rectBounds = localBounds.dilatedY( 5 );
      } );
    }

    // Render the current that moves through the coil.
    if ( options.renderCurrent ) {
      const foregroundCurrentNode = new CurrentNode( 'foreground', coil, this.foregroundCoilSegmentsParent.boundsProperty );
      this.foregroundNode.addChild( foregroundCurrentNode );

      const backgroundCurrentNode = new CurrentNode( 'background', coil, this.backgroundCoilSegmentsParent.boundsProperty );
      this.backgroundNode.addChild( backgroundCurrentNode );
    }

    // Render the segments that make up the coil's wire.
    this.coilSegmentNodes = [];
    coil.coilSegmentsProperty.link( coilSegments => this.updateCoilSegmentNodes( coilSegments ) );
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

      const parentNode = ( coilSegment.layer === 'foreground' ) ? this.foregroundCoilSegmentsParent : this.backgroundCoilSegmentsParent;
      parentNode.addChild( coilSegmentNode );
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
   * @param positionProperty - position to adjust when the background layer is dragged
   * @param providedOptions
   */
  public constructor( positionProperty: Property<Vector2>, providedOptions: CoilBackgroundNodeOptions ) {
    super( positionProperty, combineOptions<FELMovableNodeOptions>( {
      hasKeyboardDragListener: false, // It is sufficient to have alt input for the foreground layer of CoilNode.
      tandem: Tandem.OPT_OUT // There is no need to instrument the background layer of CoilNode.
    }, providedOptions ) );
  }
}

faradaysElectromagneticLab.register( 'CoilNode', CoilNode );