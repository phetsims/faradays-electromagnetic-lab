// Copyright 2023, University of Colorado Boulder

/**
 * ElectromagnetScreen is the 'Electromagnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import ElectromagnetModel from './model/ElectromagnetModel.js';
import ElectromagnetScreenView from './view/ElectromagnetScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import FELColors from '../common/FELColors.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import FELConstants from '../common/FELConstants.js';
import FELKeyboardHelpContent from '../common/view/FELKeyboardHelpContent.js';
import battery_png from '../../images/battery_png.js';

export default class ElectromagnetScreen extends Screen<ElectromagnetModel, ElectromagnetScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new ElectromagnetModel( tandem.createTandem( 'model' ) ),
      model => new ElectromagnetScreenView( model, tandem.createTandem( 'view' ) ),
      combineOptions<ScreenOptions>( {}, FELConstants.SCREEN_OPTIONS, {
          name: FaradaysElectromagneticLabStrings.screen.electromagnetStringProperty,
          homeScreenIcon: createScreenIcon(),
          createKeyboardHelpNode: () => new FELKeyboardHelpContent(),
          tandem: tandem
        }
      ) );
  }
}

/**
 * Creates the icon for this screen.
 */
function createScreenIcon(): ScreenIcon {
  const batteryImage = new Image( battery_png );
  return new ScreenIcon( batteryImage, {
    fill: FELColors.screenBackgroundColorProperty,
    maxIconWidthProportion: 0.75,
    maxIconHeightProportion: 1
  } );
}

faradaysElectromagneticLab.register( 'ElectromagnetScreen', ElectromagnetScreen );