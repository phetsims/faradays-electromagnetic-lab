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
import Coil from '../model/Coil.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnet from '../model/BarMagnet.js';
import CoilNode from './CoilNode.js';
import { Shape } from '../../../../kite/js/imports.js';

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

    // Pickup coil - 2 loops with loose spacing.
    const pickupCoilNode = createCoilNode( 2, 16 );

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

    // Electromagnet coil - 3 loops, tightly packed.
    const electromagnetCoilNode = createCoilNode( 3, 0 );

    // Pickup coil - 2 loops with loose spacing.
    const pickupCoilNode = createCoilNode( 2, 16 );

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

/**
 * Creates a coil with a specific number of loops and loop spacing.
 */
function createCoilNode( numberOfLoops: number, loopSpacing: number ): Node {

  const coil = new Coil( new NumberProperty( 0 ), FELConstants.CURRENT_AMPLITUDE_RANGE, {
    numberOfLoopsRange: new RangeWithValue( numberOfLoops, numberOfLoops, numberOfLoops ),
    loopSpacing: loopSpacing,
    maxLoopArea: 7000,
    loopAreaPercentRange: new RangeWithValue( 100, 100, 100 ),
    electronsVisible: false,
    tandem: Tandem.OPT_OUT
  } );

  // We must have a subclass of FELMovable associated with a coil's background layer. This one will do.
  const movable = new BarMagnet( { tandem: Tandem.OPT_OUT } );

  // Combine the coil foreground and background.
  const coilForegroundNode = new CoilNode( coil, movable, { tandem: Tandem.OPT_OUT } );
  return new Node( {
    children: [ coilForegroundNode.backgroundNode, coilForegroundNode ]
  } );
}

faradaysElectromagneticLab.register( 'FELScreenIconFactory', FELScreenIconFactory );
export default FELScreenIconFactory;