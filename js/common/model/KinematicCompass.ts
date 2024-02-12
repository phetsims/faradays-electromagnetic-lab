// Copyright 2023-2024, University of Colorado Boulder

/**
 * KinematicCompass rotates the compass needle using the Verlet algorithm to mimic rotational kinematics of a real
 * compass. The needle must overcome inertia, and it has angular velocity and angular acceleration. This causes the
 * needle to accelerate at it starts to move, and to wobble as it comes to rest.
 * This compass is used in the Bar Magnet and Pickup Coil screens.
 *
 * This is based on inner class KinematicBehavior of Compass.java in the Java version of this sim.
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
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ConstantDtClock from './ConstantDtClock.js';

const SENSITIVITY = 0.01; // Increase this to make the compass more sensitive to smaller fields.
const DAMPING = 0.08; // Increase this to make the needle wobble less.
const THRESHOLD = Utils.toRadians( 0.2 ); // Angle at which the needle stops wobbling and snaps to the actual field orientation.

type SelfOptions = EmptySelfOptions;

type KinematicCompassOptions = SelfOptions & CompassOptions;

export default class KinematicCompass extends Compass {

  // Angular velocity of the needle, the change in angle over time, in radians/s
  private angularVelocityProperty: Property<number>;

  // Angular acceleration of the needle, the change in angular velocity over time, in radians/s^2
  private angularAccelerationProperty: Property<number>;

  public constructor( magnet: Magnet, isPlayingProperty: TReadOnlyProperty<boolean>, providedOptions: KinematicCompassOptions ) {

    const options = optionize<KinematicCompassOptions, SelfOptions, CompassOptions>()( {

      // CompassOptions
      phetioDocumentation: 'A compass that moves gradually to match the magnetic field. It simulates the kinematics of a real-world compass.'
    }, providedOptions );

    super( magnet, isPlayingProperty, options );

    this.angularVelocityProperty = new NumberProperty( 0, {
      units: 'radians/s',
      tandem: options.tandem.createTandem( 'angularVelocityProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Angular velocity of the compass needle, to simulate kinematics.'
    } );

    this.angularAccelerationProperty = new NumberProperty( 0, {
      units: 'radians/s^2',
      tandem: options.tandem.createTandem( 'angularAccelerationProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Angular acceleration of the compass needle, to simulate kinematics.'
    } );
  }

  public override reset(): void {
    super.reset();
    this.angularVelocityProperty.reset();
    this.angularAccelerationProperty.reset();
  }

  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/67 Compass spins wildly near bar magnet poles.
  /**
   * Updates the compass needle's angle, using the Verlet algorithm to simulate the kinematics of a real-world compass.
   *
   * @param fieldVector - the magnet's B-field vector at the compass position
   * @param dt - time step, in seconds
   */
  protected override updateAngle( fieldVector: Vector2, dt: number ): void {
    assert && assert( dt === ConstantDtClock.CONSTANT_DT, `invalid dt=${dt}, see ConstantDtClock` );

    const magnitude = fieldVector.magnitude;
    const angle = fieldVector.angle;

    // Difference between the field angle and the compass angle.
    const phi = ( magnitude === 0 ) ? 0 : ( ( angle - this._angleProperty.value ) % ( 2 * Math.PI ) );

    if ( Math.abs( phi ) < THRESHOLD || this.magnet.isInside( this.positionProperty.value ) ) {

      // When the difference between the field angle and the compass angle is insignificant, or the compass is inside
      // the magnet, then simply set the angle and consider the compass to be at rest.
      this._angleProperty.value = angle;
      this.angularVelocityProperty.value = 0;
      this.angularAccelerationProperty.value = 0;
    }
    else {
      // Use the Verlet algorithm to compute angle, angular velocity, and angular acceleration.

      // Step 1: rotation
      const angularAccelerationTemp = ( SENSITIVITY * Math.sin( phi ) * magnitude ) - ( DAMPING * this.angularVelocityProperty.value );
      this._angleProperty.value = this._angleProperty.value + ( this.angularVelocityProperty.value * dt ) + ( 0.5 * angularAccelerationTemp * dt * dt );

      // Step 2: angular acceleration
      const angularVelocityTemp = this.angularVelocityProperty.value + ( angularAccelerationTemp * dt );
      this.angularAccelerationProperty.value = ( SENSITIVITY * Math.sin( phi ) * magnitude ) - ( DAMPING * angularVelocityTemp );

      // Step 3: angular velocity
      this.angularVelocityProperty.value = this.angularVelocityProperty.value + ( 0.5 * ( this.angularAccelerationProperty.value + angularAccelerationTemp ) * dt );
    }
  }

  /**
   * Workaround to get the compass moving immediately. In some situations, such as when the magnet polarity is flipped,
   * it can take quite a while for the needle to start moving. So we give the compass needle a small amount of angular
   * velocity to get it going.
   */
  public override startMovingNow(): void {
    this.angularVelocityProperty.value = 0.03; // adjust this value as needed for desired behavior
  }
}

faradaysElectromagneticLab.register( 'KinematicCompass', KinematicCompass );