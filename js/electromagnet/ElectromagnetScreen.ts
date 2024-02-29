// Copyright 2023-2024, University of Colorado Boulder

/**
 * ElectromagnetScreen is the 'Electromagnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import ElectromagnetScreenModel from './model/ElectromagnetScreenModel.js';
import ElectromagnetScreenView from './view/ElectromagnetScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import Tandem from '../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import FELConstants from '../common/FELConstants.js';
import FELKeyboardHelpContent from '../common/view/FELKeyboardHelpContent.js';
import FELScreenIconFactory from '../common/view/FELScreenIconFactory.js';

export default class ElectromagnetScreen extends Screen<ElectromagnetScreenModel, ElectromagnetScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new ElectromagnetScreenModel( tandem.createTandem( 'model' ) ),
      model => new ElectromagnetScreenView( model, tandem.createTandem( 'view' ) ),
      combineOptions<ScreenOptions>( {}, FELConstants.SCREEN_OPTIONS, {
          name: FaradaysElectromagneticLabStrings.screen.electromagnetStringProperty,
          homeScreenIcon: FELScreenIconFactory.createElectromagnetScreenIcon(),
          createKeyboardHelpNode: () => new FELKeyboardHelpContent(),
          tandem: tandem
        }
      ) );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetScreen', ElectromagnetScreen );