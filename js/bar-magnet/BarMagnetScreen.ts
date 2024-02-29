// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnetScreen is the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import BarMagnetScreenView from './view/BarMagnetScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import BarMagnetScreenModel from './model/BarMagnetScreenModel.js';
import Tandem from '../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import FELConstants from '../common/FELConstants.js';
import FELKeyboardHelpContent from '../common/view/FELKeyboardHelpContent.js';
import FELScreenIconFactory from '../common/view/FELScreenIconFactory.js';

export default class BarMagnetScreen extends Screen<BarMagnetScreenModel, BarMagnetScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new BarMagnetScreenModel( tandem.createTandem( 'model' ) ),
      model => new BarMagnetScreenView( model, tandem.createTandem( 'view' ) ),
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