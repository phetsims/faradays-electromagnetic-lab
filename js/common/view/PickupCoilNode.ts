// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoilGraphic is the visual representation of a pickup coil, with indicators (lightbulb and voltmeter )
 * for displaying the effect of electromagnetic induction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PickupCoil from '../model/PickupCoil.js';
import CoilNode from './CoilNode.js';
import FELMovableNode from './FELMovableNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import PickupCoilSamplePointsNode from './PickupCoilSamplePointsNode.js';
import Emitter from '../../../../axon/js/Emitter.js';
import FELLightBulbNode from './FELLightBulbNode.js';


export default class PickupCoilNode extends FELMovableNode {

  private readonly coilNode: CoilNode;

  // The background layer, intended to be added to the scenegraph behind the B-field, magnet, and compass, so that
  // it looks like those things are passing through the coil. It is the responsibility of the instantiator to add
  // backgroundNode to the scenegraph.
  public readonly backgroundNode: Node;

  public constructor( pickupCoil: PickupCoil, stepEmitter: Emitter<[ number ]>, tandem: Tandem ) {

    const coilNode = new CoilNode( pickupCoil, stepEmitter, {
      endsConnected: true,
      tandem: tandem.createTandem( 'coilNode' )
    } );

    const samplePointsNode = new PickupCoilSamplePointsNode( pickupCoil );

    const lightBulbNode = new FELLightBulbNode( pickupCoil.lightBulb, pickupCoil.indicatorProperty, {
      bottom: coilNode.top + 18, // determined empirically, so that it covers the coil's top connecting wire
      centerX: coilNode.centerX,
      tandem: tandem.createTandem( 'lightBulbNode' )
    } );

    super( pickupCoil, {

      // This Node's children are the foreground elements only.
      //TODO add lightNode and voltmeterNode
      children: [ coilNode, samplePointsNode, lightBulbNode ],
      tandem: tandem
    } );

    this.coilNode = coilNode;
    this.backgroundNode = this.coilNode.backgroundNode;

    // Because backgroundNode is added to the scenegraph elsewhere, ensure that its visibility remains synchronized with this Node.
    this.visibleProperty.link( visible => {
      this.backgroundNode.visible = visible;
    } );

    pickupCoil.positionProperty.link( position => {
      this.translation = position;
      this.backgroundNode.translation = position;
    } );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilNode', PickupCoilNode );