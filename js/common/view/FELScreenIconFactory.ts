// Copyright 2024, University of Colorado Boulder

/**
 * Creates screen icons for this sim.  Most of the magic numbers herein were determined empirically,
 * to match design decisions made in https://github.com/phetsims/faradays-electromagnetic-lab/issues/28.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnetNode from './BarMagnetNode.js';
import FELColors from '../FELColors.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import waterWheel_png from '../../../images/waterWheel_png.js';
import DCPowerSupplyNode from './DCPowerSupplyNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import FELConstants from '../FELConstants.js';
import Coil, { CoilOptions } from '../model/Coil.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnet from '../model/BarMagnet.js';
import CoilNode from './CoilNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

const FELScreenIconFactory = {

  /**
   * Creates the icon for the 'Bar Magnet' screen.
   */
  createBarMagnetScreenIcon(): ScreenIcon {
    return new ScreenIcon( BarMagnetNode.createIcon( new Dimension2( 150, 50 ) ), {
      fill: FELColors.screenBackgroundColorProperty,
      maxIconWidthProportion: 0.85,
      maxIconHeightProportion: 1
    } );
  },

  /**
   * Creates the icon for the 'Electromagnet' screen.
   */
  createElectromagnetScreenIcon(): ScreenIcon {
    const batteryIcon = DCPowerSupplyNode.createIcon();
    return new ScreenIcon( batteryIcon, {
      fill: FELColors.screenBackgroundColorProperty,
      maxIconWidthProportion: 0.75,
      maxIconHeightProportion: 1
    } );
  },

  /**
   * Creates the icon for the 'Pickup Coil' screen.
   */
  createPickupCoilScreenIcon(): ScreenIcon {

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
  },

  /**
   * Creates the icon for the 'Transformer' screen.
   */
  createTransformerScreenIcon(): ScreenIcon {

    const currentAmplitudeProperty = new NumberProperty( 0 );
    const currentAmplitudeRange = FELConstants.CURRENT_AMPLITUDE_RANGE;

    const coilOptions = {
      maxLoopArea: 7000,
      loopAreaPercentRange: new RangeWithValue( 100, 100, 100 ),
      tandem: Tandem.OPT_OUT
    };

    // Electromagnet coil model
    const electromagnetLoops = 3;
    const electromagnetCoil = new Coil( currentAmplitudeProperty, currentAmplitudeRange,
      combineOptions<CoilOptions>( {}, coilOptions, {
        numberOfLoopsRange: new RangeWithValue( electromagnetLoops, electromagnetLoops, electromagnetLoops ),
        loopSpacing: 0 // tightly packed
      } ) );
    electromagnetCoil.electronsVisibleProperty.value = false;

    // Pickup coil model
    const pickupCoilLoops = 2;
    const pickupCoil = new Coil( currentAmplitudeProperty, currentAmplitudeRange,
      combineOptions<CoilOptions>( {}, coilOptions, {
        numberOfLoopsRange: new RangeWithValue( pickupCoilLoops, pickupCoilLoops, pickupCoilLoops )
      } ) );
    pickupCoil.electronsVisibleProperty.value = false;

    // We must have a subclass of FELMovable associated with a coil's background layer. This one will do.
    const movable = new BarMagnet( { tandem: Tandem.OPT_OUT } );

    // Combine the electromagnet coil's foreground and background.
    const electromagnetCoilForegroundNode = new CoilNode( electromagnetCoil, movable, { tandem: Tandem.OPT_OUT } );
    const electromagnetCoilNode = new Node( {
      children: [ electromagnetCoilForegroundNode.backgroundNode, electromagnetCoilForegroundNode ]
    } );

    // Combine the pickup coil's foreground and background.
    const pickupCoilForegroundNode = new CoilNode( pickupCoil, movable, { tandem: Tandem.OPT_OUT } );
    const pickupCoilNode = new Node( {
      children: [ pickupCoilForegroundNode.backgroundNode, pickupCoilForegroundNode ]
    } );

    // Put the 2 coils side by side. HBox clipArea does not work, so use a Node and handle layout.
    pickupCoilNode.top = electromagnetCoilNode.top;
    pickupCoilNode.left = electromagnetCoilNode.right + 5;
    const hBox = new Node( {
      children: [ electromagnetCoilNode, pickupCoilNode ]
    } );

    // Clip the top part of the wire ends, y-offset was set empirically.
    //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/28 clipArea is not working when returning to the Home screen.
    hBox.clipArea = Shape.bounds( hBox.bounds.withMinY( hBox.bounds.minY + 35 ) );

    return new ScreenIcon( hBox, {
      fill: FELColors.screenBackgroundColorProperty,
      maxIconWidthProportion: 0.85,
      maxIconHeightProportion: 0.85
    } );
  },

  /**
   * Creates the icon for the 'Generator' screen.
   */
  createGeneratorScreenIcon(): ScreenIcon {

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
};

faradaysElectromagneticLab.register( 'FELScreenIconFactory', FELScreenIconFactory );
export default FELScreenIconFactory;