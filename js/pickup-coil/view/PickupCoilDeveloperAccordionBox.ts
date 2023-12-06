// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoilDeveloperAccordionBox contains developer controls for the 'Pickup Coil' screen.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { VBox } from '../../../../scenery/js/imports.js';
import PickupCoilModel from '../model/PickupCoilModel.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import FieldIntensityScaleControl from '../../common/view/FieldIntensityScaleControl.js';


export default class PickupCoilDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: PickupCoilModel ) {

    const fieldIntensityScaleControl = new FieldIntensityScaleControl( model.barMagnet.fieldIntensityScaleProperty );

    const content = new VBox( {
      spacing: 10,
      children: [ fieldIntensityScaleControl ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilDeveloperAccordionBox', PickupCoilDeveloperAccordionBox );