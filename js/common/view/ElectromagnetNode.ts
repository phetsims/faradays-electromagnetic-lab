// Copyright 2023-2024, University of Colorado Boulder

/**
 * ElectromagnetNode is the view of the electromagnet. It consists of a source coil, DC battery, and AC power supply.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Electromagnet from '../model/Electromagnet.js';
import FELMovableNode, { FELMovableNodeOptions } from './FELMovableNode.js';
import DCPowerSupplyNode from './DCPowerSupplyNode.js';
import Emitter from '../../../../axon/js/Emitter.js';
import CoilNode from './CoilNode.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import ACPowerSupplyNode from './ACPowerSupplyNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type ElectromagnetNodeOptions = SelfOptions & PickRequired<FELMovableNodeOptions, 'tandem' | 'dragBoundsProperty'>;

export default class ElectromagnetNode extends FELMovableNode {

  // The background layer, intended to be added to the scenegraph behind the B-field, magnet, and compass, so that
  // it looks like those things are passing through the coil. It is the responsibility of the instantiator to add
  // backgroundNode to the scenegraph.
  public readonly backgroundNode: Node;

  public constructor( electromagnet: Electromagnet, stepEmitter: Emitter<[ number ]>, providedOptions: ElectromagnetNodeOptions ) {

    const options = optionize<ElectromagnetNodeOptions, SelfOptions, FELMovableNodeOptions>()( {}, providedOptions );

    const coilNode = new CoilNode( electromagnet.sourceCoil, electromagnet, stepEmitter, {
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
      dcPowerSupplyNode.bottom = coilNode.top + electromagnet.sourceCoil.wireWidth / 2; // overlap end of coil

      // Position the AC power supply.
      acPowerSupplyNode.centerX = coilNode.centerX;
      acPowerSupplyNode.bottom = coilNode.top + electromagnet.sourceCoil.wireWidth / 2; // overlap end of coil
    } );

    // Debug: Show the shape used to determine whether a B-field position is inside or outside the electromagnet.
    const magnetShapeNode = new Path( Shape.bounds( electromagnet.localBounds ), {
      visibleProperty: electromagnet.shapeVisibleProperty,
      stroke: 'yellow'
    } );

    options.children = [ coilNode, dcPowerSupplyNode, acPowerSupplyNode, magnetShapeNode ];

    super( electromagnet, options );

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