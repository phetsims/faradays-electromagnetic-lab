// Copyright 2023, University of Colorado Boulder

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
import BarMagnetModel from './model/BarMagnetModel.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Tandem from '../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import FELConstants from '../common/FELConstants.js';
import FELKeyboardHelpContent from '../common/view/FELKeyboardHelpContent.js';
import BarMagnet from '../common/model/BarMagnet.js';
import BarMagnetNode from '../common/view/BarMagnetNode.js';
import Dimension2 from '../../../dot/js/Dimension2.js';

export default class BarMagnetScreen extends Screen<BarMagnetModel, BarMagnetScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new BarMagnetModel( tandem.createTandem( 'model' ) ),
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
 * Creates the icon for this screen.
 */
function createScreenIcon(): ScreenIcon {

  const barMagnet = new BarMagnet( {
    size: new Dimension2( 150, 50 ),
    tandem: Tandem.OPT_OUT
  } );

  const barMagnetNode = new BarMagnetNode( barMagnet, {
    isMovable: false,
    tandem: Tandem.OPT_OUT
  } );

  return new ScreenIcon( barMagnetNode, {
    fill: FELColors.screenBackgroundColorProperty,
    maxIconWidthProportion: 0.85,
    maxIconHeightProportion: 1
  } );
}

faradaysElectromagneticLab.register( 'BarMagnetScreen', BarMagnetScreen );