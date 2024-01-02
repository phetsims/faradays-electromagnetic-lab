// Copyright 2023, University of Colorado Boulder

/**
 * TurbineNode is the view of a turbine generator. A bar magnet is attached to a water wheel, which turns when water
 * is dispensed from a faucet. This rotation modulates this magnetic field around the bar magnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Turbine from '../model/Turbine.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnetNode from '../../common/view/BarMagnetNode.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import FaucetNode from '../../../../scenery-phet/js/FaucetNode.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import waterWheel_png from '../../../images/waterWheel_png.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import RPMDisplay from './RPMDisplay.js';
import FluidNode from './FluidNode.js';

export default class TurbineNode extends Node {

  public constructor( turbine: Turbine, layoutBounds: Bounds2, tandem: Tandem ) {

    const waterWheelNode = new WaterWheelNode( turbine, tandem.createTandem( 'waterWheelNode' ) );

    const barMagnetNode = new BarMagnetNode( turbine, {
      tandem: tandem.createTandem( 'barMagnetNode' ),
      phetioInputEnabledPropertyInstrumented: false
    } );

    const rpmDisplay = new RPMDisplay( turbine.rpmProperty, {
      radius: 0.6 * barMagnetNode.height,
      center: waterWheelNode.center
      // No PhET-iO instrumentation. There is nothing interesting here.
    } );

    const faucetNode = new FaucetNode( turbine.speedProperty.rangeProperty.value.max, turbine.speedProperty, new Property( true ), {
      scale: 0.7,
      closeOnRelease: false,
      tapToDispenseEnabled: false,
      horizontalPipeLength: 1800,
      right: layoutBounds.left + 225,
      top: layoutBounds.top + 50,
      tandem: tandem.createTandem( 'faucetNode' ),
      phetioVisiblePropertyInstrumented: false
    } );

    const fluidNode = new FluidNode( turbine.speedProperty, turbine.speedProperty.range.max );
    fluidNode.centerX = faucetNode.x;
    fluidNode.top = faucetNode.y - 2;

    super( {
      children: [ waterWheelNode, barMagnetNode, rpmDisplay, fluidNode, faucetNode ],
      tandem: tandem
    } );
  }
}

class WaterWheelNode extends Node {
  public constructor( turbine: Turbine, tandem: Tandem ) {

    //TODO Replace waterWheel_png
    const imageNode = new Image( waterWheel_png, {
      center: Vector2.ZERO
    } );

    super( {
      children: [ imageNode ],
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    } );

    turbine.positionProperty.link( position => {
      this.translation = position;
    } );

    turbine.rotationProperty.link( rotation => {
      this.rotateAround( this.center, rotation - this.rotation );
    } );
  }
}

faradaysElectromagneticLab.register( 'TurbineNode', TurbineNode );