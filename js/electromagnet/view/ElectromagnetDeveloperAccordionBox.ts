// Copyright 2023-2024, University of Colorado Boulder

/**
 * ElectromagnetDeveloperAccordionBox contains developer controls for the 'Electromagnet' screen.
 * Run with &dev query parameter to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HSeparator, VBox } from '../../../../scenery/js/imports.js';
import Electromagnet from '../../common/model/Electromagnet.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';


export default class ElectromagnetDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( electromagnet: Electromagnet ) {

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        FELDeveloperAccordionBox.createFieldScaleControl( electromagnet.fieldScaleProperty ),
        new HSeparator(),
        FELDeveloperAccordionBox.createElectromagnetControls( electromagnet )
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetDeveloperAccordionBox', ElectromagnetDeveloperAccordionBox );