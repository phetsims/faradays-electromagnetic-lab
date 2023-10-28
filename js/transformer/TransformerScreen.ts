// Copyright 2023, University of Colorado Boulder

/**
 * TransformerScreen is the 'Transformer' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import TransformerModel from './model/TransformerModel.js';
import TransformerScreenView from './view/TransformerScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import FELColors from '../common/FELColors.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Rectangle } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';

export default class TransformerScreen extends Screen<TransformerModel, TransformerScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new TransformerModel( tandem.createTandem( 'model' ) ),
      model => new TransformerScreenView( model, tandem.createTandem( 'view' ) ),
      {
        name: FaradaysElectromagneticLabStrings.screen.transformerStringProperty,
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

faradaysElectromagneticLab.register( 'TransformerScreen', TransformerScreen );