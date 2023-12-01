// Copyright 2023, University of Colorado Boulder

/**
 * KinematicCompass rotates the compass needle using the Verlet algorithm to mimic rotational kinematics of a real
 * compass. The needle must overcome inertia, and it has angular velocity and angular acceleration. This causes the
 * needle to accelerate at it starts to move, and to wobble as it comes to rest.
 * This compass is used with the BarMagnet and the PickupCoil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Compass, { CompassOptions } from './Compass.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Magnet from './Magnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

const SENSITIVITY = 0.01; // increase this to make the compass more sensitive to smaller fields
const DAMPING = 0.08; // increase this to make the needle wobble less
const THRESHOLD = Utils.toRadians( 0.2 ); // angle at which the needle stops wobbling and snaps to the actual field orientation
const SECONDS_PER_FRAME = 1 / 25; // framerate that updateRotation was step was designed to support

type SelfOptions = EmptySelfOptions;

type KinematicCompassOptions = SelfOptions & CompassOptions;

export default class KinematicCompass extends Compass {

  //TODO Do thetaProperty, omegaProperty, alphaProperty, accumulatedDtProperty really need to be stateful?

  // Angle of needle orientation (in radians)
  private thetaProperty: Property<number>;

  // Angular velocity, the change in angle over time, in radians/s
  private omegaProperty: Property<number>;

  // Angular acceleration, the change in angular velocity over time, in radians/s^2
  private alphaProperty: Property<number>;

  // Accumulated dt since the most recent call to this.step, to maintain consistent framerate
  private accumulatedDtProperty: Property<number>;

  public constructor( magnet: Magnet, providedOptions: KinematicCompassOptions ) {

    const options = providedOptions;

    super( magnet, options );

    this.thetaProperty = new NumberProperty( 0, {
      units: 'radians',
      tandem: options.tandem.createTandem( 'thetaProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Angle of the compass needle'
    } );

    this.omegaProperty = new NumberProperty( 0, {
      units: 'radians/s',
      tandem: options.tandem.createTandem( 'omegaProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Angular velocity of the compass needle'
    } );

    this.alphaProperty = new NumberProperty( 0, {
      units: 'radians/s^2',
      tandem: options.tandem.createTandem( 'alphaProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Angular acceleration of the compass needle'
    } );

    this.accumulatedDtProperty = new NumberProperty( 0, {
      units: 's',
      tandem: options.tandem.createTandem( 'accumulatedDtProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
  }

  public override reset(): void {
    super.reset();
    this.thetaProperty.reset();
    this.omegaProperty.reset();
    this.alphaProperty.reset();
    this.accumulatedDtProperty.reset();
  }

  /**
   * In the Java version, we used a clock that fired 25 times per second, with constant dt = 1.
   * In FaradayModule.java: new SwingClock( 1000 / 25, FaradayConstants.CLOCK_STEP )
   * The implementation of this class was ported from Java, and is tuned to that clock.
   * So attempt to call this at 25 fps, with a constant dt = 1.
   */
  public override step( dt: number ): void {
    this.accumulatedDtProperty.value += dt;
    if ( this.accumulatedDtProperty.value > SECONDS_PER_FRAME ) {
      super.step( 1 );
      this.accumulatedDtProperty.value -= SECONDS_PER_FRAME;
    }
  }

  //TODO wobble continues for an excessively long time when the compass is placed against either pole of the magnet, also in Java version
  /**
   * Updates the compass needle's rotation.
   * @param fieldVector - the magnet's B-field vector at the compass position
   * @param dt - time step, in seconds
   */
  protected override updateRotation( fieldVector: Vector2, dt: number ): void {
    assert && assert( dt === 1, `invalid dt=${dt}, see documentation for step` );

    const magnitude = fieldVector.magnitude;
    const angle = fieldVector.angle;

    // Difference between the field angle and the compass angle.
    const phi = ( ( magnitude === 0 ) ? 0 : ( angle - this.thetaProperty.value ) );

    if ( Math.abs( phi ) < THRESHOLD ) {

      // When the difference between the field angle and the compass angle is insignificant,
      // simply set the angle and consider the compass to be at rest.
      this.thetaProperty.value = angle;
      this.omegaProperty.value = 0;
      this.alphaProperty.value = 0;
      this._rotationProperty.value = this.thetaProperty.value;
    }
    else {
      // Use the Verlet algorithm to compute angle, angular velocity, and angular acceleration.

      // Step 1: rotation
      const thetaOld = this.thetaProperty.value;
      const alphaTemp = ( SENSITIVITY * Math.sin( phi ) * magnitude ) - ( DAMPING * this.omegaProperty.value );
      this.thetaProperty.value = this.thetaProperty.value + ( this.omegaProperty.value * dt ) + ( 0.5 * alphaTemp * dt * dt );
      if ( this.thetaProperty.value !== thetaOld ) {
        this._rotationProperty.value = this.thetaProperty.value;
      }

      // Step 2: angular acceleration
      const omegaTemp = this.omegaProperty.value + ( alphaTemp * dt );
      this.alphaProperty.value = ( SENSITIVITY * Math.sin( phi ) * magnitude ) - ( DAMPING * omegaTemp );

      // Step 3: angular velocity
      this.omegaProperty.value = this.omegaProperty.value + ( 0.5 * ( this.alphaProperty.value + alphaTemp ) * dt );
    }
  }

  /**
   * Workaround to get the compass moving immediately. In some situations, such as when the magnet polarity is flipped,
   * it can take quite a while for the needle to start moving. So we give the compass needle a small amount of angular
   * velocity to get it going.
   */
  public override startMovingNow(): void {
    this.omegaProperty.value = 0.03; // adjust this value as needed for desired behavior
  }
}

faradaysElectromagneticLab.register( 'KinematicCompass', KinematicCompass );