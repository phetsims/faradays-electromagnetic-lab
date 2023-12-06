// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoilDeveloperAccordionBox contains developer controls for the 'Pickup Coil' screen.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { HSeparator, VBox } from '../../../../scenery/js/imports.js';
import PickupCoilModel from '../model/PickupCoilModel.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import FELDeveloperNumberControl from '../../common/view/FELDeveloperNumberControl.js';


export default class PickupCoilDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: PickupCoilModel ) {

    const fieldScaleControl = FELDeveloperNumberControl.createFieldScaleControl( model.barMagnet.fieldScaleProperty );

    const lightBulbGlowScaleControl = FELDeveloperNumberControl.createLightBulbGlowScaleControl( model.lightBulb.glowScaleProperty );

    const content = new VBox( {
      spacing: 10,
      children: [
        fieldScaleControl,
        new HSeparator(),
        lightBulbGlowScaleControl
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilDeveloperAccordionBox', PickupCoilDeveloperAccordionBox );