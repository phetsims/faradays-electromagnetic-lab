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

export default class PickupCoilNode extends FELMovableNode {

  public constructor( pickupCoil: PickupCoil, tandem: Tandem ) {

    const coilNode = new CoilNode( pickupCoil, {
      endsConnected: true,
      tandem: tandem.createTandem( 'coilNode' )
    } );

    super( pickupCoil, {
      children: [ coilNode.backgroundNode, coilNode.foregroundNode ],
      tandem: tandem
    } );

    pickupCoil.positionProperty.link( position => {
      this.translation = position;
    } );

    //TODO debug view for pickupCoil.samplePointsVisibleProperty
  }
}

faradaysElectromagneticLab.register( 'PickupCoilNode', PickupCoilNode );