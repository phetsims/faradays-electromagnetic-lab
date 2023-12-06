// Copyright 2023, University of Colorado Boulder

/**
 * GeneratorDeveloperAccordionBox contains developer controls for the 'Generator' screen.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import FELConstants from '../../common/FELConstants.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import GeneratorModel from '../model/GeneratorModel.js';


export default class GeneratorDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: GeneratorModel ) {

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

faradaysElectromagneticLab.register( 'GeneratorDeveloperAccordionBox', GeneratorDeveloperAccordionBox );