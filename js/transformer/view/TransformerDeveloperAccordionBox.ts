// Copyright 2023-2024, University of Colorado Boulder

/**
 * TransformerDeveloperAccordionBox contains developer controls for the 'Transformer' screen.
 * Run with &dev query parameter to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { HSeparator, VBox } from '../../../../scenery/js/imports.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import Transformer from '../model/Transformer.js';

export default class TransformerDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( transformer: Transformer ) {

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        FELDeveloperAccordionBox.createFieldScaleControl( transformer.electromagnet.fieldScaleProperty ),
        FELDeveloperAccordionBox.createElectromagnetShapeCheckbox( transformer.electromagnet.shapeVisibleProperty ),
        new HSeparator(),
        FELDeveloperAccordionBox.createPickupCoilControls( transformer.pickupCoil )
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'TransformerDeveloperAccordionBox', TransformerDeveloperAccordionBox );