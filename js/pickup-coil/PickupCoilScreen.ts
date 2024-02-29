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
import { Node } from '../../../scenery/js/imports.js';
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
 * Creates the icon for this screen, a pickup coil.
 */
function createScreenIcon(): ScreenIcon {

  const currentAmplitudeProperty = new NumberProperty( 0 );
  const currentAmplitudeRange = FELConstants.CURRENT_AMPLITUDE_RANGE;

  // Pickup coil model
  const pickupCoilLoops = 2;
  const pickupCoil = new Coil( currentAmplitudeProperty, currentAmplitudeRange, {
    numberOfLoopsRange: new RangeWithValue( pickupCoilLoops, pickupCoilLoops, pickupCoilLoops ),
    maxLoopArea: 7000,
    loopAreaPercentRange: new RangeWithValue( 100, 100, 100 ),
    tandem: Tandem.OPT_OUT
  } );
  pickupCoil.electronsVisibleProperty.value = false;

  // We must have a subclass of FELMovable associated with a coil's background layer. This one will do.
  const movable = new BarMagnet( { tandem: Tandem.OPT_OUT } );

  // Combine the coil foreground and background.
  const pickupCoilForegroundNode = new CoilNode( pickupCoil, movable, { tandem: Tandem.OPT_OUT } );
  const pickupCoilNode = new Node( {
    children: [ pickupCoilForegroundNode.backgroundNode, pickupCoilForegroundNode ]
  } );

  // Clip the top part of the wire ends, y-offset was set empirically.
  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/28 clipArea is not working when returning to the Home screen.
  pickupCoilNode.clipArea = Shape.bounds( pickupCoilNode.bounds.withMinY( pickupCoilNode.bounds.minY + 35 ) );

  return new ScreenIcon( pickupCoilNode, {
    fill: FELColors.screenBackgroundColorProperty,
    maxIconWidthProportion: 0.85,
    maxIconHeightProportion: 0.85
  } );
}

faradaysElectromagneticLab.register( 'PickupCoilScreen', PickupCoilScreen );