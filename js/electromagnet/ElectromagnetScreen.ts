// Copyright 2023, University of Colorado Boulder

/**
 * ElectromagnetScreen is the 'Electromagnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import ElectromagnetModel from './model/ElectromagnetModel.js';
import ElectromagnetScreenView from './view/ElectromagnetScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import FELColors from '../common/FELColors.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Rectangle } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';

export default class ElectromagnetScreen extends Screen<ElectromagnetModel, ElectromagnetScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new ElectromagnetModel( tandem.createTandem( 'model' ) ),
      model => new ElectromagnetScreenView( model, tandem.createTandem( 'view' ) ),
      {
        name: FaradaysElectromagneticLabStrings.screen.electromagnetStringProperty,
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

faradaysElectromagneticLab.register( 'ElectromagnetScreen', ElectromagnetScreen );