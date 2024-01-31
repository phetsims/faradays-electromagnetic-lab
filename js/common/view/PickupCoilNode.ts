// Copyright 2023-2024, University of Colorado Boulder

/**
 * PickupCoilGraphic is the visual representation of a pickup coil, with indicators (lightbulb and voltmeter )
 * for displaying the effect of electromagnetic induction. The origin is at the center of the coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickupCoil from '../model/PickupCoil.js';
import CoilNode from './CoilNode.js';
import FELMovableNode, { FELMovableNodeOptions } from './FELMovableNode.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import PickupCoilSamplePointsNode from './PickupCoilSamplePointsNode.js';
import FELLightBulbNode from './FELLightBulbNode.js';
import VoltmeterNode from './VoltmeterNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = EmptySelfOptions;

type PickupCoilNodeOptions = SelfOptions &
  PickOptional<FELMovableNodeOptions, 'isMovable' | 'dragBoundsProperty'> &
  PickRequired<FELMovableNodeOptions, 'tandem'>;

export default class PickupCoilNode extends FELMovableNode {

  public readonly backgroundNode: Node; // See CoilNode backgroundNode

  public constructor( pickupCoil: PickupCoil, providedOptions: PickupCoilNodeOptions ) {

    const options = optionize<PickupCoilNodeOptions, SelfOptions, NodeOptions>()( {}, providedOptions );

    const coilNode = new CoilNode( pickupCoil.coil, pickupCoil, {
      dragBoundsProperty: options.dragBoundsProperty,
      isMovable: options.isMovable,
      tandem: options.tandem.createTandem( 'coilNode' )
    } );

    const samplePointsNode = new PickupCoilSamplePointsNode( pickupCoil );

    const lightBulbNode = new FELLightBulbNode( pickupCoil.lightBulb, pickupCoil.currentIndicatorProperty,
      options.tandem.createTandem( 'lightBulbNode' ) );

    const voltmeterNode = new VoltmeterNode( pickupCoil.voltmeter, pickupCoil.currentIndicatorProperty,
      coilNode.boundsProperty, options.tandem.createTandem( 'voltmeterNode' ) );

    // Dynamically position the light bulb and voltmeter when the size of the coil changes.
    coilNode.boundsProperty.link( () => {

      // x offset from the coil's origin, to account for 3D perspective. Set this by choosing voltmeter and 1 loop,
      // then verifying that the voltmeter's resistor appears to be centered on the top wire.
      const xOffset = -6;

      // Position the light bulb using x,y because there may be light rays present.
      lightBulbNode.x = coilNode.x + xOffset;
      lightBulbNode.y = coilNode.top + pickupCoil.coil.wireWidth + 2; // cover the coil's rounded ends

      // Position the voltmeter.
      voltmeterNode.centerX = coilNode.x + xOffset;
      voltmeterNode.bottom = coilNode.top + pickupCoil.coil.wireWidth - 2; // cover the coil's rounded ends
    } );

    // This Node's children are the foreground elements only.
    options.children = [ coilNode, samplePointsNode, lightBulbNode, voltmeterNode ];

    super( pickupCoil, options );

    this.backgroundNode = coilNode.backgroundNode;

    // Because backgroundNode is added to the scene graph elsewhere, ensure that its visibility remains synchronized with this Node.
    this.visibleProperty.link( visible => {
      this.backgroundNode.visible = visible;
    } );

    // Superclass FELMovableNode handles positioning this Node. But because backgroundNode is added to the scene graph
    // elsewhere, we also need to handle positioning of backgroundNode.
    pickupCoil.positionProperty.link( position => {
      this.backgroundNode.translation = position;
    } );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilNode', PickupCoilNode );