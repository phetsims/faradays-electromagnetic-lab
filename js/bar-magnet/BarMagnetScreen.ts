// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnetScreen is the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import FELConstants from '../common/FELConstants.js';
import FELPreferences from '../common/model/FELPreferences.js';
import FELKeyboardHelpContent from '../common/view/FELKeyboardHelpContent.js';
import FELScreenIconFactory from '../common/view/FELScreenIconFactory.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import BarMagnetScreenModel from './model/BarMagnetScreenModel.js';
import BarMagnetScreenView from './view/BarMagnetScreenView.js';

export default class BarMagnetScreen extends Screen<BarMagnetScreenModel, BarMagnetScreenView> {

  public constructor( preferences: FELPreferences, tandem: Tandem ) {
    super(
      () => new BarMagnetScreenModel( preferences, tandem.createTandem( 'model' ) ),
      model => new BarMagnetScreenView( model, preferences, tandem.createTandem( 'view' ) ),
      combineOptions<ScreenOptions>( {}, FELConstants.SCREEN_OPTIONS, {
          name: FaradaysElectromagneticLabStrings.screen.barMagnetStringProperty,
          homeScreenIcon: FELScreenIconFactory.createBarMagnetScreenIcon(),
          createKeyboardHelpNode: () => new FELKeyboardHelpContent(),
          tandem: tandem
        }
      ) );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetScreen', BarMagnetScreen );