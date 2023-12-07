// Copyright 2023, University of Colorado Boulder

/**
 * TransformerDeveloperAccordionBox contains developer controls for the 'Transformer' screen.
 * Run with &dev query parameter to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { HSeparator, VBox } from '../../../../scenery/js/imports.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import TransformerModel from '../model/TransformerModel.js';

export default class TransformerDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: TransformerModel, visible: boolean ) {

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        FELDeveloperAccordionBox.createFieldScaleControl( model.electromagnet.devFieldScaleProperty ),
        FELDeveloperAccordionBox.createElectromagnetShapeCheckbox( model.electromagnet.devShapeVisibleProperty ),
        new HSeparator(),
        FELDeveloperAccordionBox.createPickupCoilControls( model.pickupCoil, model.lightBulb )
      ]
    } );

    super( content, visible );
  }
}

faradaysElectromagneticLab.register( 'TransformerDeveloperAccordionBox', TransformerDeveloperAccordionBox );