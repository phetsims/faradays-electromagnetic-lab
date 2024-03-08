// Copyright 2023-2024, University of Colorado Boulder

/**
 * ElectromagnetNode is the view of the electromagnet. It consists of a source coil, DC battery, and AC power supply.
 * The origin is at the center of the coil.
 *
 * This is based on ElectromagnetGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Electromagnet from '../model/Electromagnet.js';
import FELMovableNode, { FELMovableNodeOptions } from './FELMovableNode.js';
import DCPowerSupplyNode from './DCPowerSupplyNode.js';
import CoilNode from './CoilNode.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import ACPowerSupplyNode from './ACPowerSupplyNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';

type SelfOptions = EmptySelfOptions;

type ElectromagnetNodeOptions = SelfOptions & PickRequired<FELMovableNodeOptions, 'tandem' | 'dragBoundsProperty'>;

export default class ElectromagnetNode extends FELMovableNode {

  public readonly backgroundNode: Node; // See CoilNode backgroundNode

  public constructor( electromagnet: Electromagnet, providedOptions: ElectromagnetNodeOptions ) {

    // For most Nodes, PhET-iO clients would typically use inputEnabledProperty to control whether the Node is draggable.
    // ElectromagnetNode is more complicated, because its subcomponents have sliders that should be disabled
    // independently of dragging, and because coilNode.backgroundNode is also draggable. So the cleanest way to
    // address this is to introduce this new Property.
    const dragEnabledProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'dragEnabledProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Set this to false to disable dragging, while still being able to change sliders.'
    } );

    const options = optionize<ElectromagnetNodeOptions, SelfOptions, FELMovableNodeOptions>()( {

      // FELMovableNodeOptions
      dragListenerOptions: {
        enabledProperty: dragEnabledProperty
      },
      keyboardDragListenerOptions: {
        enabledProperty: dragEnabledProperty
      }
    }, providedOptions );

    const coilNode = new CoilNode( electromagnet.coil, electromagnet, {
      tandem: options.tandem.createTandem( 'coilNode' )
    } );

    const dcPowerSupplyNode = new DCPowerSupplyNode( electromagnet.dcPowerSupply, electromagnet.currentSourceProperty,
      options.tandem.createTandem( 'dcPowerSupplyNode' ) );

    const acPowerSupplyNode = new ACPowerSupplyNode( electromagnet.acPowerSupply, electromagnet.currentSourceProperty,
      options.tandem.createTandem( 'acPowerSupplyNode' ) );

    // Debug: Show the shape used to determine whether a B-field position is inside or outside the electromagnet.
    const magnetShapeNode = new Path( Shape.bounds( electromagnet.localBounds ), {
      visibleProperty: electromagnet.shapeVisibleProperty,
      stroke: 'yellow'
    } );

    options.children = [ coilNode, dcPowerSupplyNode, acPowerSupplyNode, magnetShapeNode ];

    super( electromagnet, options );

    this.backgroundNode = coilNode.backgroundNode;

    // Dynamically position the battery and power supply when the size of the coil changes.
    Multilink.multilink( [ coilNode.localBoundsProperty, coilNode.backgroundNode.localBoundsProperty, acPowerSupplyNode.localBoundsProperty ],
      () => {

        // Include the background layer of the coil, which is added to the scene graph in a different coordinate frame.
        const globalBounds = coilNode.backgroundNode.localToGlobalBounds( coilNode.backgroundNode.localBounds );
        const localBounds = coilNode.globalToParentBounds( globalBounds );
        const coilBounds = coilNode.bounds.union( localBounds );

        // Position the DC power supply.
        dcPowerSupplyNode.centerX = coilBounds.centerX;
        dcPowerSupplyNode.bottom = coilBounds.top + electromagnet.coil.wireWidth / 2; // overlap end of coil

        // Position the AC power supply.
        acPowerSupplyNode.centerX = coilBounds.centerX;
        acPowerSupplyNode.bottom = coilBounds.top + electromagnet.coil.wireWidth / 2; // overlap end of coil
      } );

    // Because backgroundNode is added to the scene graph elsewhere, ensure that its visibility remains synchronized with this Node.
    this.visibleProperty.link( visible => {
      this.backgroundNode.visible = visible;
    } );

    // Because backgroundNode is added to the scene graph elsewhere, ensure that it is draggable only if this Node is draggable.
    Multilink.multilink( [ dragEnabledProperty, this.inputEnabledProperty ],
      ( dragEnabled, inputEnabled ) => {
        this.backgroundNode.inputEnabled = ( dragEnabled && inputEnabled );
        this.cursor = ( dragEnabled && inputEnabled ) ? 'pointer' : null;
      } );

    this.inputEnabledProperty.link( inputEnabled => {
      this.backgroundNode.inputEnabledProperty.value = inputEnabled;
    } );

    // Superclass FELMovableNode handles positioning this Node. But because backgroundNode is added to the scene graph
    // elsewhere, we also need to handle positioning of backgroundNode.
    electromagnet.positionProperty.link( position => {
      this.backgroundNode.translation = position;
    } );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetNode', ElectromagnetNode );