// Copyright 2023, University of Colorado Boulder

/**
 * ElectromagnetDeveloperAccordionBox contains developer controls for the 'Electromagnet' screen.
 * Run with &dev query parameter to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { VBox } from '../../../../scenery/js/imports.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import ElectromagnetModel from '../model/ElectromagnetModel.js';


export default class ElectromagnetDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: ElectromagnetModel, visible: boolean ) {

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        FELDeveloperAccordionBox.createFieldScaleControl( model.electromagnet.devFieldScaleProperty ),
        FELDeveloperAccordionBox.createElectromagnetShapeCheckbox( model.electromagnet.devShapeVisibleProperty )
      ]
    } );

    super( content, visible );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetDeveloperAccordionBox', ElectromagnetDeveloperAccordionBox );