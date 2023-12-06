// Copyright 2023, University of Colorado Boulder

/**
 * GeneratorDeveloperAccordionBox contains developer controls for the 'Generator' screen.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { HSeparator, VBox } from '../../../../scenery/js/imports.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import GeneratorModel from '../model/GeneratorModel.js';

export default class GeneratorDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: GeneratorModel ) {

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        FELDeveloperAccordionBox.createFieldScaleControl( model.turbine.fieldScaleProperty ),
        new HSeparator(),
        FELDeveloperAccordionBox.createPickupCoilControls( model.pickupCoil, model.lightBulb )
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'GeneratorDeveloperAccordionBox', GeneratorDeveloperAccordionBox );