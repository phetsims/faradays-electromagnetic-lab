// Copyright 2023, University of Colorado Boulder

/**
 * IncrementalCompass tracks the B-field exactly, except when the delta angle exceeds some threshold.
 * When the threshold is exceeded, the needle angle changes incrementally over time.
 * This compass is used with the Electromagnet and the Transformer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Compass, { CompassOptions } from './Compass.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Magnet from './Magnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

const MAX_INCREMENT = Utils.toRadians( 45 );

type SelfOptions = EmptySelfOptions;

type IncrementalCompassOptions = SelfOptions & CompassOptions;

export default class IncrementalCompass extends Compass {

  public constructor( magnet: Magnet, providedOptions: IncrementalCompassOptions ) {
    super( magnet, providedOptions );
  }

  protected override updateRotation( fieldVector: Vector2, dt: number ): void {

    // Calculate the delta angle
    const fieldAngle = fieldVector.angle;
    const needleAngle = this._rotationProperty.value;
    let delta = fieldAngle - needleAngle;

    // Normalize the angle to the range -355...+355 degrees
    if ( Math.abs( delta ) >= ( 2 * Math.PI ) ) {
      const sign = ( delta < 0 ) ? -1 : +1;
      delta = sign * ( delta % ( 2 * Math.PI ) );
    }

    // Convert to an equivalent angle in the range -180...+180 degrees.
    if ( delta > Math.PI ) {
      delta = delta - ( 2 * Math.PI );
    }
    else if ( delta < -Math.PI ) {
      delta = delta + ( 2 * Math.PI );
    }

    if ( Math.abs( delta ) < MAX_INCREMENT ) {

      // If the delta is small, rotate immediately to the field angle.
      this._rotationProperty.value = fieldAngle;
    }
    else {

      // If the delta is large, rotate incrementally.
      const sign = ( delta < 0 ) ? -1 : 1;
      delta = sign * MAX_INCREMENT;
      this._rotationProperty.value = needleAngle + delta;
    }
  }

  public override startMovingNow(): void {
    // Do nothing
  }
}

faradaysElectromagneticLab.register( 'IncrementalCompass', IncrementalCompass );