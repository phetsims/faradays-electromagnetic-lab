// Copyright 2023-2024, University of Colorado Boulder

/**
 * Voltmeter is the model of a voltmeter, as an indicator of current in the pickup coil. The meter's needle behaves
 * somewhat realistically, by jiggling around the zero point.
 *
 * This is based on Voltmeter.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Utils from '../../../../dot/js/Utils.js';
import FELConstants from '../FELConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CurrentIndicator, { CurrentIndicatorOptions } from './CurrentIndicator.js';
import Range from '../../../../dot/js/Range.js';
import ConstantDtClock from './ConstantDtClock.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';

// When the angle is this close to zero, move immediately to zero.
const ZERO_THRESHOLD = Utils.toRadians( 0.5 );

// Damping as the needle moves back towards zero. Decrease this to make the needle move more slowly.
const NEEDLE_DAMPING = 0.24;
assert && assert( NEEDLE_DAMPING > 0 && NEEDLE_DAMPING <= 1 );

// Kinematics of the needle are enabled by default.
const DEFAULT_KINEMATICS_ENABLED_PROPERTY: TReadOnlyProperty<boolean> = new BooleanProperty( true );

type SelfOptions = {
  kinematicsEnabledProperty?: TReadOnlyProperty<boolean>;
};

export type VoltmeterOptions = SelfOptions & PickRequired<CurrentIndicatorOptions, 'tandem'>;

export default class Voltmeter extends CurrentIndicator {

  // The amplitude of the current in the pickup coil.
  private readonly currentAmplitudeProperty: TReadOnlyProperty<number>;
  private readonly currentAmplitudeRange: Range;

  // The deflection angle of the voltmeter's needle, relative to zero volts.
  public readonly needleAngleProperty: TReadOnlyProperty<number>;
  private readonly _needleAngleProperty: NumberProperty;
  private readonly needAngleRange: Range;

  // Whether kinematics of the needle is enabled.
  private readonly kinematicsEnabledProperty: TReadOnlyProperty<boolean>;

  public constructor( currentAmplitudeProperty: TReadOnlyProperty<number>,
                      currentAmplitudeRange: Range,
                      providedOptions: VoltmeterOptions ) {

    const options = optionize<VoltmeterOptions, SelfOptions, CurrentIndicatorOptions>()( {

      // SelfOptions
      kinematicsEnabledProperty: DEFAULT_KINEMATICS_ENABLED_PROPERTY
    }, providedOptions );

    super( options );

    this.currentAmplitudeProperty = currentAmplitudeProperty;
    this.currentAmplitudeRange = currentAmplitudeRange;

    this.needAngleRange = new Range( -Math.PI / 2, Math.PI / 2 );
    this._needleAngleProperty = new NumberProperty( 0, {
      units: 'radians',
      range: this.needAngleRange,
      tandem: options.tandem.createTandem( 'needleAngleProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );
    this.needleAngleProperty = this._needleAngleProperty;

    this.kinematicsEnabledProperty = options.kinematicsEnabledProperty;
  }

  public reset(): void {
    this._needleAngleProperty.reset();
  }

  public step( dt: number ): void {
    assert && assert( dt === ConstantDtClock.DT, `invalid dt=${dt}` );

    // Determine the desired needle deflection angle.
    const desiredNeedleAngle = this.getDesiredNeedleAngle();

    const deltaAngle = ( desiredNeedleAngle - this._needleAngleProperty.value ) % ( 2 * Math.PI );

    if ( deltaAngle !== 0 ) {
      if ( !this.kinematicsEnabledProperty.value || Math.abs( desiredNeedleAngle ) > Math.abs( this._needleAngleProperty.value ) ) {

        // If kinematics is disabled, or the desired angle is larger than the current angle, move immediately to the desired angle.
        this._needleAngleProperty.value = desiredNeedleAngle;
      }
      else if ( Math.abs( deltaAngle ) < ZERO_THRESHOLD ) {

        // The needle is close enough to zero, so move immediately to zero.
        this._needleAngleProperty.value = 0;
      }
      else {

        // Move incrementally towards zero, decelerating as we get closer to zero.
        this._needleAngleProperty.value += ( NEEDLE_DAMPING * deltaAngle );
      }
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