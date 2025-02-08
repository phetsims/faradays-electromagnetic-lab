// Copyright 2024-2025, University of Colorado Boulder

/**
 * WaterWheelNode is a wheel with a set of blades, equally spaced around its circumference. When water hits the blades,
 * it causes the wheel to rotate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import waterWheel_png from '../../../images/waterWheel_png.js';
import BarMagnet from '../../common/model/BarMagnet.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

export default class WaterWheelNode extends Node {

  public constructor( barMagnet: BarMagnet ) {

    const imageNode = new Image( waterWheel_png, {
      center: Vector2.ZERO
    } );

    super( {
      children: [ imageNode ]
    } );

    barMagnet.positionProperty.link( position => {
      this.translation = position;
    } );

    barMagnet.rotationProperty.link( rotation => {
      this.rotateAround( this.center, rotation - this.rotation );
    } );
  }
}

faradaysElectromagneticLab.register( 'WaterWheelNode', WaterWheelNode );