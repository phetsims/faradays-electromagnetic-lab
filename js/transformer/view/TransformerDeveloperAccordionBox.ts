// Copyright 2023, University of Colorado Boulder

/**
 * TransformerDeveloperAccordionBox contains developer controls for the 'Transformer' screen.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { HSeparator, VBox } from '../../../../scenery/js/imports.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import TransformerModel from '../model/TransformerModel.js';
import FELDeveloperNumberControl from '../../common/view/FELDeveloperNumberControl.js';


export default class TransformerDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: TransformerModel ) {

    const fieldScaleControl = FELDeveloperNumberControl.createFieldScaleControl( model.electromagnet.fieldScaleProperty );

    const lightBulbGlowScaleControl = FELDeveloperNumberControl.createLightBulbGlowScaleControl( model.lightBulb.glowScaleProperty );

    const content = new VBox( {
      spacing: 10,
      children: [
        fieldScaleControl,
        new HSeparator(),
        lightBulbGlowScaleControl
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'TransformerDeveloperAccordionBox', TransformerDeveloperAccordionBox );