// Copyright 2023-2025, University of Colorado Boulder

/**
 * IncrementalCompass tracks the B-field exactly, except when the delta angle exceeds some threshold.
 * When the threshold is exceeded, the needle angle changes incrementally over time.
 * This compass is used in the Electromagnet and Transformer screens.
 *
 * This is based on inner class IncrementalBehavior of Compass.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Compass, { CompassOptions } from './Compass.js';
import ConstantDtClock from './ConstantDtClock.js';
import Magnet from './Magnet.js';

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
   * Updates the compass needle's angle. This is a no-op if the field magnitude is zero.
   *
   * @param fieldVector - the magnet's B-field vector at the compass position
   * @param dt - time step, in seconds
   */
  protected override updateNeedleAngle( fieldVector: Vector2, dt: number ): void {
    assert && assert( dt === ConstantDtClock.DT, `invalid dt=${dt}` );

    if ( fieldVector.magnitude !== 0 ) {

      // Calculate the change in angle needed to align the compass needle with the magnetic field.
      const fieldAngle = fieldVector.angle;
      const needleAngle = this._needleAngleProperty.value;
      let deltaAngle = ( fieldAngle - needleAngle ) % ( 2 * Math.PI );

      if ( deltaAngle !== 0 ) {

        // If |deltaAngle| is > 180 degrees, rotate the shorter equivalent angle in the opposite direction.
        // For example, if deltaAngle is +270 degrees, the shorter equivalent is -90 degrees.
        if ( Math.abs( Math.abs( deltaAngle ) - Math.PI ) < 1e-6 ) {

          // This first case addresses https://github.com/phetsims/faradays-electromagnetic-lab/issues/76.
          // When deltaAngle is very close to Math.PI, floating-point error may cause the compass needle to rotate
          // clockwise on one cycle, counterclockwise on the next cycle. This workaround gives us consistent rotation
          // direction on every cycle. This is obvious with the electromagnet and AC power supply, where the magnetic
          // field polarity is constantly flipping, and a stationary compass will repeatedly rotate Math.PI.
          deltaAngle = Math.PI;
        }
        else if ( deltaAngle > Math.PI ) {
          deltaAngle = deltaAngle - ( 2 * Math.PI );
        }
        else if ( deltaAngle < -Math.PI ) {
          deltaAngle = deltaAngle + ( 2 * Math.PI );
        }

        if ( Math.abs( deltaAngle ) < MAX_DELTA_ANGLE ) {

          // If the delta is small, rotate immediately to the field angle.
          this.updateNeedleAngleImmediately( fieldAngle );
        }
        else {

          // If the delta is large, rotate incrementally.
          this._needleAngleProperty.value += Math.sign( deltaAngle ) * MAX_DELTA_ANGLE;
        }
      }
    }
  }
}

faradaysElectromagneticLab.register( 'IncrementalCompass', IncrementalCompass );