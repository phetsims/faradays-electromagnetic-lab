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

type SelfOptions = EmptySelfOptions;

type ElectromagnetNodeOptions = SelfOptions & PickRequired<FELMovableNodeOptions, 'tandem' | 'dragBoundsProperty'>;

export default class ElectromagnetNode extends FELMovableNode {

  public readonly backgroundNode: Node; // See CoilNode backgroundNode

  public constructor( electromagnet: Electromagnet, providedOptions: ElectromagnetNodeOptions ) {

    const options = optionize<ElectromagnetNodeOptions, SelfOptions, FELMovableNodeOptions>()( {}, providedOptions );

    const coilNode = new CoilNode( electromagnet.coil, electromagnet, {
      tandem: options.tandem.createTandem( 'coilNode' )
    } );

    const dcPowerSupplyNode = new DCPowerSupplyNode( electromagnet.dcPowerSupply, electromagnet.currentSourceProperty,
      options.tandem.createTandem( 'dcPowerSupplyNode' ) );

    const acPowerSupplyNode = new ACPowerSupplyNode( electromagnet.acPowerSupply, electromagnet.currentSourceProperty,
      options.tandem.createTandem( 'acPowerSupplyNode' ) );

    // Dynamically position the battery and power supply when the size of the coil changes.
    coilNode.boundsProperty.link( () => {

      // Position the DC power supply.
      dcPowerSupplyNode.centerX = coilNode.centerX;
      dcPowerSupplyNode.bottom = coilNode.top + electromagnet.coil.wireWidth / 2; // overlap end of coil

      // Position the AC power supply.
      acPowerSupplyNode.centerX = coilNode.centerX;
      acPowerSupplyNode.bottom = coilNode.top + electromagnet.coil.wireWidth / 2; // overlap end of coil
    } );

    // Debug: Show the shape used to determine whether a B-field position is inside or outside the electromagnet.
    const magnetShapeNode = new Path( Shape.bounds( electromagnet.localBounds ), {
      visibleProperty: electromagnet.shapeVisibleProperty,
      stroke: 'yellow'
    } );

    options.children = [ coilNode, dcPowerSupplyNode, acPowerSupplyNode, magnetShapeNode ];

    super( electromagnet, options );

    this.backgroundNode = coilNode.backgroundNode;

    // Because backgroundNode is added to the scene graph elsewhere, ensure that its visibility remains synchronized with this Node.
    this.visibleProperty.link( visible => {
      this.backgroundNode.visible = visible;
    } );

    // Because backgroundNode is added to the scene graph elsewhere, ensure that it is draggable only if this Node is draggable.
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