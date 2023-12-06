// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoilDeveloperAccordionBox contains developer controls for the 'Pickup Coil' screen.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { HSeparator, VBox } from '../../../../scenery/js/imports.js';
import PickupCoilModel from '../model/PickupCoilModel.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import FELDeveloperNumberControl from '../../common/view/FELDeveloperNumberControl.js';

export default class PickupCoilDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: PickupCoilModel ) {

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        FELDeveloperNumberControl.createFieldScaleControl( model.barMagnet.fieldScaleProperty ),
        new HSeparator(),
        FELDeveloperNumberControl.createMaxEMFControl( model.pickupCoil.maxEMFProperty ),
        new HSeparator(),
        FELDeveloperNumberControl.createTransitionSmoothingScaleControl( model.pickupCoil.transitionSmoothingScaleProperty ),
        new HSeparator(),
        FELDeveloperNumberControl.createElectronSpeedScaleControl( model.pickupCoil.electronSpeedScaleProperty ),
        new HSeparator(),
        FELDeveloperNumberControl.createLightBulbGlowScaleControl( model.lightBulb.glowScaleProperty ),
        new HSeparator(),
        FELDeveloperAccordionBox.createPickupCoilSamplePointsVisibleCheckbox( model.pickupCoil.samplePointsVisibleProperty ),
        FELDeveloperAccordionBox.createPickupCoilFluxVisibleCheckbox( model.pickupCoil.fluxVisibleProperty )
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilDeveloperAccordionBox', PickupCoilDeveloperAccordionBox );