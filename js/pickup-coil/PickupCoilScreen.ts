// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import PickupCoilModel from './model/PickupCoilModel.js';
import PickupCoilScreenView from './view/PickupCoilScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import FELColors from '../common/FELColors.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Rectangle } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';

export default class PickupCoilScreen extends Screen<PickupCoilModel, PickupCoilScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new PickupCoilModel( tandem.createTandem( 'model' ) ),
      model => new PickupCoilScreenView( model, tandem.createTandem( 'view' ) ),
      {
        name: FaradaysElectromagneticLabStrings.screen.pickupCoilStringProperty,
        backgroundColorProperty: FELColors.screenBackgroundColorProperty,
        homeScreenIcon: createHomeScreenIcon(),
        showUnselectedHomeScreenIconFrame: true,
        tandem: tandem
      }
    );
  }
}

function createHomeScreenIcon(): ScreenIcon {
  return new ScreenIcon( new Rectangle( 0, 0, 1, 1 ), {
    fill: FELColors.screenBackgroundColorProperty,
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

faradaysElectromagneticLab.register( 'PickupCoilScreen', PickupCoilScreen );