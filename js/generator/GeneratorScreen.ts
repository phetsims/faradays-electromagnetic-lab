// Copyright 2023-2024, University of Colorado Boulder

/**
 * GeneratorScreen is the 'Generator' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import GeneratorScreenModel from './model/GeneratorScreenModel.js';
import GeneratorScreenView from './view/GeneratorScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import Tandem from '../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import FELConstants from '../common/FELConstants.js';
import GeneratorKeyboardHelpContent from './view/GeneratorKeyboardHelpContent.js';
import FELScreenIconFactory from '../common/view/FELScreenIconFactory.js';
import FELPreferences from '../common/model/FELPreferences.js';

export default class GeneratorScreen extends Screen<GeneratorScreenModel, GeneratorScreenView> {

  public constructor( preferences: FELPreferences, tandem: Tandem ) {
    super(
      () => new GeneratorScreenModel( preferences, tandem.createTandem( 'model' ) ),
      model => new GeneratorScreenView( model, tandem.createTandem( 'view' ) ),
      combineOptions<ScreenOptions>( {}, FELConstants.SCREEN_OPTIONS, {
          name: FaradaysElectromagneticLabStrings.screen.generatorStringProperty,
          homeScreenIcon: FELScreenIconFactory.createGeneratorScreenIcon(),
          createKeyboardHelpNode: () => new GeneratorKeyboardHelpContent(),
          tandem: tandem
        }
      ) );
  }
}

faradaysElectromagneticLab.register( 'GeneratorScreen', GeneratorScreen );