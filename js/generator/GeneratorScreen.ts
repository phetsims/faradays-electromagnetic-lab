// Copyright 2023, University of Colorado Boulder

/**
 * GeneratorScreen is the 'Generator' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import GeneratorModel from './model/GeneratorModel.js';
import GeneratorScreenView from './view/GeneratorScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import FELColors from '../common/FELColors.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Rectangle } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';

export default class GeneratorScreen extends Screen<GeneratorModel, GeneratorScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new GeneratorModel( tandem.createTandem( 'model' ) ),
      model => new GeneratorScreenView( model, tandem.createTandem( 'view' ) ),
      {
        name: FaradaysElectromagneticLabStrings.screen.generatorStringProperty,
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

faradaysElectromagneticLab.register( 'GeneratorScreen', GeneratorScreen );