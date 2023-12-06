// Copyright 2023, University of Colorado Boulder

/**
 * ElectromagnetDeveloperAccordionBox contains developer controls for the 'Electromagnet' screen.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import FELConstants from '../../common/FELConstants.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import ElectromagnetModel from '../model/ElectromagnetModel.js';


export default class ElectromagnetDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: ElectromagnetModel ) {

    const content = new VBox( {
      spacing: 10,
      children: [
        new Text( 'Under Construction', {
          font: FELConstants.CONTROL_FONT
        } )
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetDeveloperAccordionBox', ElectromagnetDeveloperAccordionBox );