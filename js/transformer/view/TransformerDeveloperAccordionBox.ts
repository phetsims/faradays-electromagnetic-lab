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

export default class TransformerDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: TransformerModel ) {

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        FELDeveloperAccordionBox.createFieldScaleControl( model.electromagnet.fieldScaleProperty ),
        new HSeparator(),
        FELDeveloperAccordionBox.createMaxEMFControl( model.pickupCoil.maxEMFProperty ),
        new HSeparator(),
        FELDeveloperAccordionBox.createTransitionSmoothingScaleControl( model.pickupCoil.transitionSmoothingScaleProperty ),
        new HSeparator(),
        FELDeveloperAccordionBox.createElectronSpeedScaleControl( model.pickupCoil.electronSpeedScaleProperty ),
        new HSeparator(),
        FELDeveloperAccordionBox.createLightBulbGlowScaleControl( model.lightBulb.glowScaleProperty ),
        new HSeparator(),
        FELDeveloperAccordionBox.createElectromagnetShapeVisibleCheckbox( model.electromagnet.shapeVisibleProperty ),
        FELDeveloperAccordionBox.createPickupCoilSamplePointsVisibleCheckbox( model.pickupCoil.samplePointsVisibleProperty ),
        FELDeveloperAccordionBox.createPickupCoilFluxVisibleCheckbox( model.pickupCoil.fluxVisibleProperty )
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'TransformerDeveloperAccordionBox', TransformerDeveloperAccordionBox );