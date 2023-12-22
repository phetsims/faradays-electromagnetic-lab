// Copyright 2023, University of Colorado Boulder

/**
 * TODO
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

export default class TurbineNode extends Node {

  public constructor( turbine: Turbine, layoutBounds: Bounds2, tandem: Tandem ) {

    const waterWheelNode = new WaterWheelNode( turbine, tandem.createTandem( 'waterWheelNode' ) );

    const barMagnetNode = new BarMagnetNode( turbine, {
      tandem: tandem.createTandem( 'barMagnetNode' ),
      phetioInputEnabledPropertyInstrumented: false
    } );

    const faucetNode = new FaucetNode( turbine.speedProperty.rangeProperty.value.max, turbine.speedProperty, new Property( true ), {
      scale: 0.65,
      closeOnRelease: false,
      tapToDispenseEnabled: false,
      horizontalPipeLength: 2000,
      right: layoutBounds.left + 225,
      top: layoutBounds.top + 50,
      tandem: tandem.createTandem( 'faucetNode' ),
      phetioVisiblePropertyInstrumented: false
    } );

    super( {
      children: [ waterWheelNode, barMagnetNode, faucetNode ],
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
      tandem: tandem
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