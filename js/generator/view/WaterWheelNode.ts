// Copyright 2023, University of Colorado Boulder

/**
 * WaterWheelNode is a wheel with a set of blades equally spaced around it circumference. When water hits the blades,
 * it causes the wheel to rotate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Image, Node } from '../../../../scenery/js/imports.js';
import Turbine from '../model/Turbine.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import waterWheel_png from '../../../images/waterWheel_png.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

export default class WaterWheelNode extends Node {

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

faradaysElectromagneticLab.register( 'WaterWheelNode', WaterWheelNode );
