// Copyright 2023, University of Colorado Boulder

/**
 * ImmediateCompass immediately sets the compass direction to match the direction of the B-field.
 * This compass is used with the Generator.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Compass from './Compass.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Magnet from './Magnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class ImmediateCompass extends Compass {

  public constructor( magnet: Magnet, tandem: Tandem ) {
    super( magnet, tandem );
  }

  public override setDirection( fieldVector: Vector2, dt: number ): void {
    this.rotationProperty.value = fieldVector.angle;
  }

  public override startMovingNow(): void {
    // Do nothing
  }
}

faradaysElectromagneticLab.register( 'ImmediateCompass', ImmediateCompass );