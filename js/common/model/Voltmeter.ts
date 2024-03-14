// Copyright 2023-2024, University of Colorado Boulder

/**
 * Voltmeter is the model of a voltmeter, as an indicator of current in the pickup coil. The meter's needle behaves
 * somewhat realistically, by jiggling around the zero point.
 *
 * This is based on Voltmeter.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Utils from '../../../../dot/js/Utils.js';
import FELConstants from '../FELConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CurrentIndicator from './CurrentIndicator.js';
import Range from '../../../../dot/js/Range.js';
import ConstantDtClock from './ConstantDtClock.js';
import Property from '../../../../axon/js/Property.js';

// Define the zero point of the needle.
const ZERO_NEEDLE_ANGLE = Utils.toRadians( 0 );

// The needle deflection range is this much on either side of the zero point.
const MAX_NEEDLE_ANGLE = Utils.toRadians( 90 );

// If rotational kinematics is enabled, the needle will jiggle this much around the zero reading.
const NEEDLE_JIGGLE_ANGLE = Utils.toRadians( 3 );

// When the angle is this close to zero, the needle stops jiggling.
const NEEDLE_JIGGLE_THRESHOLD = Utils.toRadians( 0.5 );

// Determines how much the needle jiggles around the zero point.
// The value L should be such that 0 < L < 1.
// If set to 0, the needle will not jiggle at all.
// If set to 1, the needle will oscillate forever.
const NEEDLE_LIVELINESS = 0.6;
assert && assert( NEEDLE_LIVELINESS > 0 && NEEDLE_LIVELINESS < 1 );

export default class Voltmeter extends CurrentIndicator {

  // The amplitude of the current in the pickup coil.
  private readonly currentAmplitudeProperty: TReadOnlyProperty<number>;
  private readonly currentAmplitudeRange: Range;

  // The deflection angle of the voltmeter's needle, relative to zero volts.
  public readonly needleAngleProperty: TReadOnlyProperty<number>;
  private readonly _needleAngleProperty: NumberProperty;
  private readonly needAngleRange: Range;

  // Angular velocity of the needle, the change in angle over time, in radians/s
  private angularVelocityProperty: Property<number>;

  // Angular acceleration of the needle, the change in angular velocity over time, in radians/s^2
  private angularAccelerationProperty: Property<number>;

  public constructor( currentAmplitudeProperty: TReadOnlyProperty<number>, currentAmplitudeRange: Range, tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    this.currentAmplitudeProperty = currentAmplitudeProperty;
    this.currentAmplitudeRange = currentAmplitudeRange;

    this.needAngleRange = new Range( -MAX_NEEDLE_ANGLE, MAX_NEEDLE_ANGLE );
    this._needleAngleProperty = new NumberProperty( 0, {
      units: 'radians',
      range: this.needAngleRange,
      tandem: tandem.createTandem( 'needleAngleProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );
    this.needleAngleProperty = this._needleAngleProperty;

    this.angularVelocityProperty = new NumberProperty( 0, {
      units: 'radians/s',
      tandem: tandem.createTandem( 'angularVelocityProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Angular velocity of the voltmeter needle, to simulate kinematics.'
    } );

    this.angularAccelerationProperty = new NumberProperty( 0, {
      units: 'radians/s^2',
      tandem: tandem.createTandem( 'angularAccelerationProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Angular acceleration of the voltmeter needle, to simulate kinematics.'
    } );
  }

  public reset(): void {
    this._needleAngleProperty.reset();
  }

  public step( dt: number ): void {
    assert && assert( dt === ConstantDtClock.DT, `invalid dt=${dt}` );

    // Determine the desired needle deflection angle.
    const desiredNeedleAngle = this.getDesiredNeedleAngle();

    const deltaAngle = ( desiredNeedleAngle - this._needleAngleProperty.value ) % ( 2 * Math.PI );

    if ( deltaAngle === 0 ) {
      // Do nothing, the needle is not moving.
    }
    else if ( desiredNeedleAngle !== ZERO_NEEDLE_ANGLE ) {

      // If we're not moving to zero, set the desired angle immediately.
      this._needleAngleProperty.value = desiredNeedleAngle;
    }
    else if ( Math.abs( deltaAngle ) < NEEDLE_JIGGLE_THRESHOLD ) {

      // The needle is close enough to zero, so stop jiggling.
      this._needleAngleProperty.value = ZERO_NEEDLE_ANGLE;
    }
    else {

      // Jiggle the needle around the zero point.
      let jiggleAngle = -deltaAngle * NEEDLE_LIVELINESS;
      jiggleAngle = Utils.clamp( jiggleAngle, -NEEDLE_JIGGLE_ANGLE, NEEDLE_JIGGLE_ANGLE );
      this._needleAngleProperty.value = jiggleAngle;
    }
  }

  /**
   * Gets the desired needle deflection angle, in radians.
   * This is the angle that corresponds exactly to the voltage read by the meter.
   */
  private getDesiredNeedleAngle(): number {

    // Use amplitude of the voltage source as our signal.
    let currentAmplitude = this.currentAmplitudeProperty.value;

    // Absolute amplitude below the threshold is effectively zero.
    if ( Math.abs( currentAmplitude ) < FELConstants.CURRENT_AMPLITUDE_THRESHOLD ) {
      currentAmplitude = 0;
    }

    // Map from currentAmplitude to needleAngle.
    return Utils.linear(
      this.currentAmplitudeRange.min, this.currentAmplitudeRange.max,
      this.needAngleRange.min, this.needAngleRange.max,
      currentAmplitude
    );
  }
}

faradaysElectromagneticLab.register( 'Voltmeter', Voltmeter );