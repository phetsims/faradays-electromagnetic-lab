// Copyright 2023-2025, University of Colorado Boulder

/**
 * PickupCoilDeveloperAccordionBox contains developer controls for the 'Pickup Coil' screen.
 * Run with &dev query parameter to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import BarMagnet from '../../common/model/BarMagnet.js';
import PickupCoil from '../../common/model/PickupCoil.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

export default class PickupCoilDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( barMagnet: BarMagnet, pickupCoil: PickupCoil ) {

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        FELDeveloperAccordionBox.createFieldScaleControl( barMagnet.fieldScaleProperty ),
        new HSeparator(),
        FELDeveloperAccordionBox.createPickupCoilControls( pickupCoil )
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilDeveloperAccordionBox', PickupCoilDeveloperAccordionBox );