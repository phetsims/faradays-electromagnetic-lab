// Copyright 2023-2024, University of Colorado Boulder

/**
 * PickupCoilScreen is the 'Pickup Coil' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import PickupCoilScreenModel from './model/PickupCoilScreenModel.js';
import PickupCoilScreenView from './view/PickupCoilScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import Tandem from '../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import FELConstants from '../common/FELConstants.js';
import FELKeyboardHelpContent from '../common/view/FELKeyboardHelpContent.js';
import FELScreenIconFactory from '../common/view/FELScreenIconFactory.js';

export default class PickupCoilScreen extends Screen<PickupCoilScreenModel, PickupCoilScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new PickupCoilScreenModel( tandem.createTandem( 'model' ) ),
      model => new PickupCoilScreenView( model, tandem.createTandem( 'view' ) ),
      combineOptions<ScreenOptions>( {}, FELConstants.SCREEN_OPTIONS, {
          name: FaradaysElectromagneticLabStrings.screen.pickupCoilStringProperty,
          homeScreenIcon: FELScreenIconFactory.createPickupCoilScreenIcon(),
          createKeyboardHelpNode: () => new FELKeyboardHelpContent(),
          tandem: tandem
        }
      ) );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilScreen', PickupCoilScreen );