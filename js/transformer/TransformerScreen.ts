// Copyright 2023-2024, University of Colorado Boulder

/**
 * TransformerScreen is the 'Transformer' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import TransformerScreenModel from './model/TransformerScreenModel.js';
import TransformerScreenView from './view/TransformerScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import FELColors from '../common/FELColors.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { HBox, Node, VBox, VStrut } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import FELConstants from '../common/FELConstants.js';
import FELKeyboardHelpContent from '../common/view/FELKeyboardHelpContent.js';
import { NumberProperty } from '../../../axon/js/imports.js';
import Coil, { CoilOptions } from '../common/model/Coil.js';
import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import BarMagnet from '../common/model/BarMagnet.js';
import CoilNode from '../common/view/CoilNode.js';
import { Shape } from '../../../kite/js/imports.js';
import Bounds2 from '../../../dot/js/Bounds2.js';

export default class TransformerScreen extends Screen<TransformerScreenModel, TransformerScreenView> {

  public constructor( tandem: Tandem ) {
    super(
      () => new TransformerScreenModel( tandem.createTandem( 'model' ) ),
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

  const currentAmplitudeProperty = new NumberProperty( 0 );
  const currentAmplitudeRange = FELConstants.CURRENT_AMPLITUDE_RANGE;

  const coilOptions = {
    maxLoopArea: 7000,
    loopAreaPercentRange: new RangeWithValue( 100, 100, 100 ),
    tandem: Tandem.OPT_OUT
  };

  // Electromagnet coil model
  const electromagnetCoil = new Coil( currentAmplitudeProperty, currentAmplitudeRange,
    combineOptions<CoilOptions>( {}, coilOptions, {
      numberOfLoopsRange: new RangeWithValue( 4, 4, 4 ),
      //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/28 Fix the implementation of loopSpacing so that we can use loopSpacing:0 here.
      loopSpacing: 16 // Electromagnet has a tightly packed coil.
    } ) );
  electromagnetCoil.electronsVisibleProperty.value = false;

  // Pickup coil model
  const pickupCoil = new Coil( currentAmplitudeProperty, currentAmplitudeRange,
    combineOptions<CoilOptions>( {}, coilOptions, {
      numberOfLoopsRange: new RangeWithValue( 2, 2, 2 )
    } ) );
  pickupCoil.electronsVisibleProperty.value = false;

  // A hack, because we must have a subclass of FELMovable associated with a coil's background layer.
  const movable = new BarMagnet( {
    tandem: Tandem.OPT_OUT
  } );

  // Combine the electromagnet coil's foreground and background.
  const electromagnetCoilForegroundNode = new CoilNode( electromagnetCoil, movable, {
    tandem: Tandem.OPT_OUT
  } );
  const electromagnetCoilNode = new Node( {
    children: [ electromagnetCoilForegroundNode.backgroundNode, electromagnetCoilForegroundNode ]
  } );

  // Combine the pickup coil's foreground and background.
  const pickupCoilForegroundNode = new CoilNode( pickupCoil, movable, {
    tandem: Tandem.OPT_OUT
  } );
  const pickupCoilNode = new Node( {
    children: [ pickupCoilForegroundNode.backgroundNode, pickupCoilForegroundNode ]
  } );

  const hBox = new HBox( {
    children: [ electromagnetCoilNode, pickupCoilNode ],
    spacing: 15,
    align: 'top'
  } );

  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/28 clipArea is not working when returning to the Home screen.
  hBox.clipArea = Shape.bounds( new Bounds2( hBox.bounds.minX, hBox.bounds.minY + 30, hBox.bounds.maxX, hBox.bounds.maxY ) );

  // Add a bit of space below the coils.
  const icon = new VBox( {
    children: [ hBox, new VStrut( 20 ) ]
  } );

  return new ScreenIcon( icon, {
    fill: FELColors.screenBackgroundColorProperty,
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}


faradaysElectromagneticLab.register( 'TransformerScreen', TransformerScreen );