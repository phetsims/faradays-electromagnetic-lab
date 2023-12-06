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
import FieldIntensityScaleControl from '../../common/view/FieldIntensityScaleControl.js';


export default class GeneratorDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: GeneratorModel ) {

    const fieldIntensityScaleControl = new FieldIntensityScaleControl( model.turbine.fieldIntensityScaleProperty );

    const content = new VBox( {
      spacing: 10,
      children: [ fieldIntensityScaleControl ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'GeneratorDeveloperAccordionBox', GeneratorDeveloperAccordionBox );