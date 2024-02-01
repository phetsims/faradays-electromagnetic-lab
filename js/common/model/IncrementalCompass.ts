// Copyright 2023-2024, University of Colorado Boulder

/**
 * IncrementalCompass tracks the B-field exactly, except when the delta angle exceeds some threshold.
 * When the threshold is exceeded, the needle angle changes incrementally over time.
 * This compass is used in the Electromagnet and Transformer screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Compass, { CompassOptions } from './Compass.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Magnet from './Magnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

const MAX_DELTA_ANGLE = Utils.toRadians( 45 );

type SelfOptions = EmptySelfOptions;

type IncrementalCompassOptions = SelfOptions & CompassOptions;

export default class IncrementalCompass extends Compass {

  public constructor( magnet: Magnet, isPlayingProperty: TReadOnlyProperty<boolean>, providedOptions: IncrementalCompassOptions ) {

    const options = optionize<IncrementalCompassOptions, SelfOptions, CompassOptions>()( {

      // CompassOptions
      phetioDocumentation: 'A compass that moves immediately to match the direction of the magnetic field, except ' +
                           'when the field change is large. In that case, the compass moves incrementally.'
    }, providedOptions );

    super( magnet, isPlayingProperty, options );
  }

  /**
   * Updates the compass needle's angle.
   * @param fieldVector - the magnet's B-field vector at the compass position
   * @param dt - time step, in seconds
   */
  protected override updateAngle( fieldVector: Vector2, dt: number ): void {

    // Calculate the delta angle
    const fieldAngle = fieldVector.angle;
    const needleAngle = this._angleProperty.value;
    let deltaAngle = fieldAngle - needleAngle;

    if ( deltaAngle !== 0 ) {

      // Normalize the angle to the range -355...+355 degrees
      if ( Math.abs( deltaAngle ) >= ( 2 * Math.PI ) ) {
        const sign = ( deltaAngle < 0 ) ? -1 : +1;
        deltaAngle = sign * ( deltaAngle % ( 2 * Math.PI ) );
      }

      // Convert to an equivalent angle in the range -180...+180 degrees.
      if ( deltaAngle > Math.PI ) {
        deltaAngle = deltaAngle - ( 2 * Math.PI );
      }
      else if ( deltaAngle < -Math.PI ) {
        deltaAngle = deltaAngle + ( 2 * Math.PI );
      }

      if ( Math.abs( deltaAngle ) < MAX_DELTA_ANGLE ) {

        // If the delta is small, rotate immediately to the field angle.
        this._angleProperty.value = fieldAngle;
      }
      else {

        // If the delta is large, rotate incrementally.
        const sign = ( deltaAngle < 0 ) ? -1 : 1;
        deltaAngle = sign * MAX_DELTA_ANGLE;
        this._angleProperty.value = needleAngle + deltaAngle;
      }
    }
  }
}

faradaysElectromagneticLab.register( 'IncrementalCompass', IncrementalCompass );