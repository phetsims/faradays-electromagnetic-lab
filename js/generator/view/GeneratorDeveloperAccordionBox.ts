// Copyright 2023, University of Colorado Boulder

/**
 * GeneratorDeveloperAccordionBox contains developer controls for the 'Generator' screen.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { VBox } from '../../../../scenery/js/imports.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import GeneratorModel from '../model/GeneratorModel.js';
import FELDeveloperNumberControl from '../../common/view/FELDeveloperNumberControl.js';


export default class GeneratorDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: GeneratorModel ) {

    const fieldScaleControl = FELDeveloperNumberControl.createFieldScaleControl( model.turbine.fieldScaleProperty );

    const content = new VBox( {
      spacing: 10,
      children: [ fieldScaleControl ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'GeneratorDeveloperAccordionBox', GeneratorDeveloperAccordionBox );