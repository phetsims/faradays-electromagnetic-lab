// Copyright 2023-2024, University of Colorado Boulder

/**
 * TransformerScreen is the 'Transformer' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import TransformerModel from './model/TransformerModel.js';
import TransformerScreenView from './view/TransformerScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import FELColors from '../common/FELColors.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { HBox, Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import FELConstants from '../common/FELConstants.js';
import FELKeyboardHelpContent from '../common/view/FELKeyboardHelpContent.js';
import lightBulbOn_png from '../../../scenery-phet/mipmaps/lightBulbOn_png.js';
import DCPowerSupplyNode from '../common/view/DCPowerSupplyNode.js';

export default class TransformerScreen extends Screen<TransformerModel, TransformerScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new TransformerModel( tandem.createTandem( 'model' ) ),
      model => new TransformerScreenView( model, tandem.createTandem( 'view' ) ),
      combineOptions<ScreenOptions>( {}, FELConstants.SCREEN_OPTIONS, {
          name: FaradaysElectromagneticLabStrings.screen.transformerStringProperty,
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

  const iconNode = new HBox( {
    spacing: 5,
    children: [ DCPowerSupplyNode.createIcon(), new Image( lightBulbOn_png ) ]
  } );

  return new ScreenIcon( iconNode, {
    fill: FELColors.screenBackgroundColorProperty,
    maxIconWidthProportion: 0.85,
    maxIconHeightProportion: 0.85
  } );
}

faradaysElectromagneticLab.register( 'TransformerScreen', TransformerScreen );