// Copyright 2023, University of Colorado Boulder

/**
 * ElectromagnetDeveloperAccordionBox contains developer controls for the 'Electromagnet' screen.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { HSeparator, VBox } from '../../../../scenery/js/imports.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import ElectromagnetModel from '../model/ElectromagnetModel.js';
import FELDeveloperNumberControl from '../../common/view/FELDeveloperNumberControl.js';


export default class ElectromagnetDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: ElectromagnetModel ) {

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        FELDeveloperNumberControl.createFieldScaleControl( model.electromagnet.fieldScaleProperty ),
        new HSeparator(),
        FELDeveloperAccordionBox.createElectromagnetShapeVisibleCheckbox( model.electromagnet.shapeVisibleProperty )
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetDeveloperAccordionBox', ElectromagnetDeveloperAccordionBox );