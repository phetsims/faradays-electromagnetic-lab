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


export default class PickupCoilNode extends FELMovableNode {

  private readonly coilNode: CoilNode;

  // This Node is the background layer, intended to be added to the scenegraph behind the B-field, magnet, and compass,
  // so that it looks like those things are passing through the coil. It is the responsibility of the instantiator to
  // add backgroundNode to the scenegraph.
  public readonly backgroundNode: Node;

  public constructor( pickupCoil: PickupCoil, tandem: Tandem ) {

    const coilNode = new CoilNode( pickupCoil, {
      endsConnected: true,
      tandem: tandem.createTandem( 'coilNode' )
    } );

    super( pickupCoil, {

      // This Node's children are the foreground elements only.
      //TODO add lightNode and voltmeterNode
      children: [ coilNode.foregroundNode ],
      tandem: tandem
    } );

    this.coilNode = coilNode;
    this.backgroundNode = this.coilNode.backgroundNode;

    pickupCoil.positionProperty.link( position => {
      this.translation = position;
      this.backgroundNode.translation = position;
    } );

    //TODO Add debug view for pickupCoil.samplePointsVisibleProperty
  }
}

faradaysElectromagneticLab.register( 'PickupCoilNode', PickupCoilNode );