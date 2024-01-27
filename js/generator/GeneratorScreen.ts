// Copyright 2023-2024, University of Colorado Boulder

/**
 * GeneratorScreen is the 'Generator' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import GeneratorModel from './model/GeneratorModel.js';
import GeneratorScreenView from './view/GeneratorScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import FELColors from '../common/FELColors.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Tandem from '../../../tandem/js/Tandem.js';
import { Image, Node } from '../../../scenery/js/imports.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import FELConstants from '../common/FELConstants.js';
import FELKeyboardHelpContent from '../common/view/FELKeyboardHelpContent.js';
import waterWheel_png from '../../images/waterWheel_png.js';
import BarMagnetNode from '../common/view/BarMagnetNode.js';

export default class GeneratorScreen extends Screen<GeneratorModel, GeneratorScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new GeneratorModel( tandem.createTandem( 'model' ) ),
      model => new GeneratorScreenView( model, tandem.createTandem( 'view' ) ),
      combineOptions<ScreenOptions>( {}, FELConstants.SCREEN_OPTIONS, {
          name: FaradaysElectromagneticLabStrings.screen.generatorStringProperty,
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

  const waterWheelImage = new Image( waterWheel_png );

  const barMagnetIcon = BarMagnetNode.createIcon();
  barMagnetIcon.setScaleMagnitude( 0.95 * waterWheelImage.width / barMagnetIcon.width );
  barMagnetIcon.center = waterWheelImage.center;

  const iconNode = new Node( {
    children: [ waterWheelImage, barMagnetIcon ]
  } );

  return new ScreenIcon( iconNode, {
    fill: FELColors.screenBackgroundColorProperty,
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 0.9
  } );
}

faradaysElectromagneticLab.register( 'GeneratorScreen', GeneratorScreen );