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
import { Node, Rectangle, VBox, VStrut } from '../../../scenery/js/imports.js';
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
 * Creates the icon for this screen.
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

  // A hack, because we must have a subclass of FELMovable associated with the coil's background layer.
  const movable = new BarMagnet( {
    tandem: Tandem.OPT_OUT
  } );

  // Combine the coil foreground and background.
  const pickupCoilForegroundNode = new CoilNode( pickupCoil, movable, {
    tandem: Tandem.OPT_OUT
  } );
  const pickupCoilNode = new Node( {
    children: [ pickupCoilForegroundNode.backgroundNode, pickupCoilForegroundNode ]
  } );

  // Clip the top part of the wire ends.
  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/28 clipArea is not working when returning to the Home screen.
  pickupCoilNode.clipArea = Shape.bounds( pickupCoilNode.bounds.withMinY( pickupCoilNode.bounds.minY + 35 ) );

  // Add a bit of space below the coil.
  const vBox = new VBox( {
    children: [ pickupCoilNode, new VStrut( 8 ) ]
  } );

  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/28 For debugging bounds and clipArea, delete this.
  const boundsRectangle = new Rectangle( vBox.bounds, {
    stroke: phet.chipper.queryParameters.dev ? 'red' : null
  } );

  const icon = new Node( {
    children: [ vBox, boundsRectangle ]
  } );

  return new ScreenIcon( icon, {
    fill: FELColors.screenBackgroundColorProperty,
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

faradaysElectromagneticLab.register( 'PickupCoilScreen', PickupCoilScreen );