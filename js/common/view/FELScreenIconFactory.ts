// Copyright 2024, University of Colorado Boulder

/**
 * FELScreenIconFactory is a collection of functions for creating screen icons. The 'magic numbers' herein were determined
 * empirically, to match design decisions made in https://github.com/phetsims/faradays-electromagnetic-lab/issues/28.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnetNode from './BarMagnetNode.js';
import FELColors from '../FELColors.js';
import { HBox, Image, Node } from '../../../../scenery/js/imports.js';
import waterWheel_png from '../../../images/waterWheel_png.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import FELConstants from '../FELConstants.js';
import Coil from '../model/Coil.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnet from '../model/BarMagnet.js';
import CoilNode from './CoilNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import { CurrentFlow } from '../FELQueryParameters.js';
import Property from '../../../../axon/js/Property.js';
import Dimension3 from '../../../../dot/js/Dimension3.js';
import DCPowerSupplyPanel from './DCPowerSupplyPanel.js';

const FELScreenIconFactory = {

  /**
   * Creates the icon for the 'Bar Magnet' screen.
   */
  createBarMagnetScreenIcon(): ScreenIcon {
    return new ScreenIcon( createBarMagnetNode( new Dimension3( 150, 50, 20 ) ), {
      fill: FELColors.screenBackgroundColorProperty,
      maxIconWidthProportion: 0.85,
      maxIconHeightProportion: 1
    } );
  },

  /**
   * Creates the icon for the 'Pickup Coil' screen.
   */
  createPickupCoilScreenIcon(): ScreenIcon {
    return new ScreenIcon( createCoilNode( 3, 16, 30000 ), {
      fill: FELColors.screenBackgroundColorProperty,
      maxIconWidthProportion: 0.85,
      maxIconHeightProportion: 0.85
    } );
  },

  /**
   * Creates the icon for the 'Electromagnet' screen.
   */
  createElectromagnetScreenIcon(): ScreenIcon {
    return new ScreenIcon( DCPowerSupplyPanel.createIcon(), {
      fill: FELColors.screenBackgroundColorProperty,
      maxIconWidthProportion: 0.75,
      maxIconHeightProportion: 1
    } );
  },

  /**
   * Creates the icon for the 'Transformer' screen.
   */
  createTransformerScreenIcon(): ScreenIcon {

    // Electromagnet coil, tightly packed.
    const electromagnetCoilNode = createCoilNode( 3, 0, 10000 );

    // Pickup coil, loosely packed.
    const pickupCoilNode = createCoilNode( 4, 10, 30000 );

    // Put the 2 coils side by side.
    const hBox = new HBox( {
      children: [ electromagnetCoilNode, pickupCoilNode ],
      spacing: 45
    } );

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

    const barMagnetIcon = createBarMagnetNode();
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
 * Creates an icon for the bar magnet.
 */
function createBarMagnetNode( size?: Dimension3 ): Node {

  const barMagnet = new BarMagnet( {
    size: size,
    tandem: Tandem.OPT_OUT
  } );

  return new BarMagnetNode( barMagnet, {
    isMovable: false, // This is an icon, so this bar magnet cannot be dragged.
    tandem: Tandem.OPT_OUT
  } );
}

/**
 * Creates a coil with a specific number of loops and loop spacing.
 */
function createCoilNode( numberOfLoops: number, loopSpacing: number, maxLoopArea: number ): Node {

  const coil = new Coil( new NumberProperty( 0 ), FELConstants.NORMALIZED_CURRENT_RANGE, new Property<CurrentFlow>( 'electron' ), {
    numberOfLoopsRange: new RangeWithValue( numberOfLoops, numberOfLoops, numberOfLoops ),
    loopSpacing: loopSpacing,
    maxLoopArea: maxLoopArea,
    loopAreaPercentRange: new RangeWithValue( 100, 100, 100 ),
    currentVisible: false,
    tandem: Tandem.OPT_OUT
  } );

  // We must have a subclass of FELMovable associated with a coil's background layer. This one will do.
  const movable = new BarMagnet( { tandem: Tandem.OPT_OUT } );

  // Combine the coil foreground and background.
  const coilForegroundNode = new CoilNode( coil, movable, {
    renderCurrent: false, // Don't create unnecessary WebGL contexts for current that we don't want to see.
    tandem: Tandem.OPT_OUT
  } );
  const node = new Node( {
    children: [ coilForegroundNode.backgroundNode, coilForegroundNode ]
  } );

  // Clip the top part of the coil ends. y-offset was set empirically.
  node.clipArea = Shape.bounds( node.bounds.withMinY( node.bounds.minY + 35 ) );

  return node;
}

faradaysElectromagneticLab.register( 'FELScreenIconFactory', FELScreenIconFactory );
export default FELScreenIconFactory;