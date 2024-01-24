// Copyright 2023, University of Colorado Boulder

/**
 * GeneratorDeveloperAccordionBox contains developer controls for the 'Generator' screen.
 * Run with &dev query parameter to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { HSeparator, VBox } from '../../../../scenery/js/imports.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import BarMagnet from '../../common/model/BarMagnet.js';
import PickupCoil from '../../common/model/PickupCoil.js';

export default class GeneratorDeveloperAccordionBox extends FELDeveloperAccordionBox {

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

faradaysElectromagneticLab.register( 'GeneratorDeveloperAccordionBox', GeneratorDeveloperAccordionBox );