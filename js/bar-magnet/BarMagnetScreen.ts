// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnetScreen is the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import FELColors from '../common/FELColors.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import BarMagnetScreenView from './view/BarMagnetScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import BarMagnetScreenModel from './model/BarMagnetScreenModel.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Tandem from '../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import FELConstants from '../common/FELConstants.js';
import FELKeyboardHelpContent from '../common/view/FELKeyboardHelpContent.js';
import BarMagnetNode from '../common/view/BarMagnetNode.js';
import Dimension2 from '../../../dot/js/Dimension2.js';

export default class BarMagnetScreen extends Screen<BarMagnetScreenModel, BarMagnetScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new BarMagnetScreenModel( tandem.createTandem( 'model' ) ),
      model => new BarMagnetScreenView( model, tandem.createTandem( 'view' ) ),
      combineOptions<ScreenOptions>( {}, FELConstants.SCREEN_OPTIONS, {
          name: FaradaysElectromagneticLabStrings.screen.barMagnetStringProperty,
          homeScreenIcon: createScreenIcon(),
          createKeyboardHelpNode: () => new FELKeyboardHelpContent(),
          tandem: tandem
        }
      ) );
  }
}

/**
 * Creates the icon for this screen, a bar magnet.
 */
function createScreenIcon(): ScreenIcon {
  return new ScreenIcon( BarMagnetNode.createIcon( new Dimension2( 150, 50 ) ), {
    fill: FELColors.screenBackgroundColorProperty,
    maxIconWidthProportion: 0.85,
    maxIconHeightProportion: 1
  } );
}

faradaysElectromagneticLab.register( 'BarMagnetScreen', BarMagnetScreen );