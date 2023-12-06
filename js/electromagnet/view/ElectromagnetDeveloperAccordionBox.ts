// Copyright 2023, University of Colorado Boulder

/**
 * ElectromagnetDeveloperAccordionBox contains developer controls for the 'Electromagnet' screen.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { VBox } from '../../../../scenery/js/imports.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import ElectromagnetModel from '../model/ElectromagnetModel.js';
import FieldIntensityScaleControl from '../../common/view/FieldIntensityScaleControl.js';


export default class ElectromagnetDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: ElectromagnetModel ) {

    const fieldIntensityScaleControl = new FieldIntensityScaleControl( model.electromagnet.fieldIntensityScaleProperty );

    const content = new VBox( {
      spacing: 10,
      children: [
        fieldIntensityScaleControl
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetDeveloperAccordionBox', ElectromagnetDeveloperAccordionBox );