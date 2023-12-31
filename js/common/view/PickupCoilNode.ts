// Copyright 2023-2024, University of Colorado Boulder

/**
 * PickupCoilGraphic is the visual representation of a pickup coil, with indicators (lightbulb and voltmeter )
 * for displaying the effect of electromagnetic induction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickupCoil from '../model/PickupCoil.js';
import CoilNode from './CoilNode.js';
import FELMovableNode, { FELMovableNodeOptions } from './FELMovableNode.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import PickupCoilSamplePointsNode from './PickupCoilSamplePointsNode.js';
import Emitter from '../../../../axon/js/Emitter.js';
import FELLightBulbNode from './FELLightBulbNode.js';
import VoltmeterNode from './VoltmeterNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

type PickupCoilNodeOptions = SelfOptions & Pick<FELMovableNodeOptions, 'tandem' | 'isMovable'>;

export default class PickupCoilNode extends FELMovableNode {

  // The background layer, intended to be added to the scenegraph behind the B-field, magnet, and compass, so that
  // it looks like those things are passing through the coil. It is the responsibility of the instantiator to add
  // backgroundNode to the scenegraph.
  public readonly backgroundNode: Node;

  public constructor( pickupCoil: PickupCoil, stepEmitter: Emitter<[ number ]>, providedOptions: PickupCoilNodeOptions ) {

    const options = optionize<PickupCoilNodeOptions, SelfOptions, NodeOptions>()( {}, providedOptions );

    const coilNode = new CoilNode( pickupCoil, stepEmitter, {
      endsConnected: true,
      isMovable: options.isMovable,
      tandem: options.tandem.createTandem( 'coilNode' )
    } );

    const samplePointsNode = new PickupCoilSamplePointsNode( pickupCoil );

    const lightBulbNode = new FELLightBulbNode( pickupCoil.lightBulb, pickupCoil.currentIndicatorProperty,
      options.tandem.createTandem( 'lightBulbNode' ) );

    const voltmeterNode = new VoltmeterNode( pickupCoil.voltmeter, pickupCoil.currentIndicatorProperty,
      options.tandem.createTandem( 'voltmeterNode' ) );

    // Dynamically position the light bulb and voltmeter when the size of the coil changes.
    coilNode.boundsProperty.link( () => {

      // Position the light bulb using x,y because there may be light rays present.
      lightBulbNode.x = coilNode.centerX;
      lightBulbNode.y = coilNode.top + pickupCoil.wireWidth + 2; // cover the coil's top connecting wire

      // Position the voltmeter.
      voltmeterNode.centerX = coilNode.centerX;
      voltmeterNode.bottom = coilNode.top + pickupCoil.wireWidth + 2; // cover the coil's top connecting wire
    } );

    // This Node's children are the foreground elements only.
    options.children = [ coilNode, samplePointsNode, lightBulbNode, voltmeterNode ];

    super( pickupCoil, options );

    this.backgroundNode = coilNode.backgroundNode;

    // Because backgroundNode is added to the scenegraph elsewhere, ensure that its visibility remains synchronized with this Node.
    this.visibleProperty.link( visible => {
      this.backgroundNode.visible = visible;
    } );

    // Superclass FELMovableNode handles positioning this Node. But because backgroundNode is added to the scenegraph
    // elsewhere, we also need to handle positioning of backgroundNode.
    pickupCoil.positionProperty.link( position => {
      this.backgroundNode.translation = position;
    } );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilNode', PickupCoilNode );