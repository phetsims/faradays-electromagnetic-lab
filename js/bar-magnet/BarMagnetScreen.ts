// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetScreen is the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import FELColors from '../common/FELColors.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import BarMagnetScreenView from './view/BarMagnetScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import BarMagnetModel from './model/BarMagnetModel.js';
import { Rectangle } from '../../../scenery/js/imports.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Tandem from '../../../tandem/js/Tandem.js';

export default class BarMagnetScreen extends Screen<BarMagnetModel, BarMagnetScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new BarMagnetModel( tandem.createTandem( 'model' ) ),
      model => new BarMagnetScreenView( model, tandem.createTandem( 'view' ) ),
      {
        name: FaradaysElectromagneticLabStrings.screen.barMagnetStringProperty,
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

faradaysElectromagneticLab.register( 'BarMagnetScreen', BarMagnetScreen );