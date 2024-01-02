// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Electromagnet from '../model/Electromagnet.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FELMovableNode from './FELMovableNode.js';
import BatteryNode from './BatteryNode.js';
import Emitter from '../../../../axon/js/Emitter.js';
import CoilNode from './CoilNode.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import ACPowerSupplyNode from './ACPowerSupplyNode.js';

export default class ElectromagnetNode extends FELMovableNode {

  // The background layer, intended to be added to the scenegraph behind the B-field, magnet, and compass, so that
  // it looks like those things are passing through the coil. It is the responsibility of the instantiator to add
  // backgroundNode to the scenegraph.
  public readonly backgroundNode: Node;

  public constructor( electromagnet: Electromagnet, stepEmitter: Emitter<[ number ]>, tandem: Tandem ) {

    const coilNode = new CoilNode( electromagnet.sourceCoil, stepEmitter, {
      tandem: tandem.createTandem( 'coilNode' )
    } );

    const batteryNode = new BatteryNode( electromagnet.battery, electromagnet.currentSourceProperty,
      tandem.createTandem( 'batteryNode' ) );

    const acPowerSupplyNode = new ACPowerSupplyNode( electromagnet.acPowerSupply, electromagnet.currentSourceProperty,
      tandem.createTandem( 'acPowerSupplyNode' ) );

    // Dynamically position the battery and power supply when the size of the coil changes.
    coilNode.boundsProperty.link( () => {

      // Position battery.
      batteryNode.centerX = coilNode.centerX;
      batteryNode.bottom = coilNode.top + electromagnet.sourceCoil.wireWidth / 2; // overlap end of coil

      // Position the power supply.
      acPowerSupplyNode.centerX = coilNode.centerX;
      acPowerSupplyNode.bottom = coilNode.top + electromagnet.sourceCoil.wireWidth / 2; // overlap end of coil
    } );

    // Debug: Show the shape used to determine whether a B-field position is inside or outside the electromagnet.
    const magnetShapeNode = new Path( electromagnet.shape, {
      visibleProperty: electromagnet.shapeVisibleProperty,
      stroke: 'yellow'
    } );

    super( electromagnet, {
      children: [ coilNode, batteryNode, acPowerSupplyNode, magnetShapeNode ],
      tandem: tandem
    } );

    this.backgroundNode = coilNode.backgroundNode;

    // Because backgroundNode is added to the scenegraph elsewhere, ensure that its visibility remains synchronized with this Node.
    this.visibleProperty.link( visible => {
      this.backgroundNode.visible = visible;
    } );

    // Superclass FELMovableNode handles positioning this Node. But because backgroundNode is added to the scenegraph
    // elsewhere, we also need to handle positioning of backgroundNode.
    electromagnet.positionProperty.link( position => {
      this.backgroundNode.translation = position;
    } );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetNode', ElectromagnetNode );