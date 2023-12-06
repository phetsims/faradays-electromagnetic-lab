// Copyright 2023, University of Colorado Boulder

/**
 * TransformerDeveloperAccordionBox contains developer controls for the 'Transformer' screen.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import FELConstants from '../../common/FELConstants.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import TransformerModel from '../model/TransformerModel.js';


export default class TransformerDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: TransformerModel ) {

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

faradaysElectromagneticLab.register( 'TransformerDeveloperAccordionBox', TransformerDeveloperAccordionBox );