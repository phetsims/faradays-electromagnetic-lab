// Copyright 2023-2024, University of Colorado Boulder

/**
 * PickupCoilScreen is the 'Pickup Coil' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import PickupCoilScreenModel from './model/PickupCoilScreenModel.js';
import PickupCoilScreenView from './view/PickupCoilScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import FELColors from '../common/FELColors.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Node, VBox, VStrut } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import FELConstants from '../common/FELConstants.js';
import FELKeyboardHelpContent from '../common/view/FELKeyboardHelpContent.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Coil from '../common/model/Coil.js';
import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import BarMagnet from '../common/model/BarMagnet.js';
import CoilNode from '../common/view/CoilNode.js';
import { Shape } from '../../../kite/js/imports.js';
import Bounds2 from '../../../dot/js/Bounds2.js';

export default class PickupCoilScreen extends Screen<PickupCoilScreenModel, PickupCoilScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new PickupCoilScreenModel( tandem.createTandem( 'model' ) ),
      model => new PickupCoilScreenView( model, tandem.createTandem( 'view' ) ),
      combineOptions<ScreenOptions>( {}, FELConstants.SCREEN_OPTIONS, {
          name: FaradaysElectromagneticLabStrings.screen.pickupCoilStringProperty,
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

  // Coil model
  const currentAmplitudeProperty = new NumberProperty( 0 );
  const currentAmplitudeRange = FELConstants.CURRENT_AMPLITUDE_RANGE;
  const coil = new Coil( currentAmplitudeProperty, currentAmplitudeRange, {
    numberOfLoopsRange: new RangeWithValue( 3, 3, 3 ),
    maxLoopArea: 7000,
    loopAreaPercentRange: new RangeWithValue( 100, 100, 100 ),
    tandem: Tandem.OPT_OUT
  } );
  coil.electronsVisibleProperty.value = false;

  // A hack, because we must have a subclass of FELMovable associated with the coil's background layer.
  const movable = new BarMagnet( {
    tandem: Tandem.OPT_OUT
  } );

  // Coil foreground
  const coilForegroundNode = new CoilNode( coil, movable, {
    tandem: Tandem.OPT_OUT
  } );

  // Combine the coil foreground and background. Clip the top part of the wire ends.
  const coilNode = new Node( {
    children: [ coilForegroundNode.backgroundNode, coilForegroundNode ]
  } );
  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/28 clipArea is not working when returning to the Home screen.
  coilNode.clipArea = Shape.bounds( new Bounds2( coilNode.bounds.minX, coilNode.bounds.minY + 30, coilNode.bounds.maxX, coilNode.bounds.maxY ) );

  // Add a bit of space below the coil.
  const icon = new VBox( {
    children: [ coilNode, new VStrut( 8 ) ]
  } );

  return new ScreenIcon( icon, {
    fill: FELColors.screenBackgroundColorProperty,
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

faradaysElectromagneticLab.register( 'PickupCoilScreen', PickupCoilScreen );