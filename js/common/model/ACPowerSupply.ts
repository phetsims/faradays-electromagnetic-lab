// Copyright 2023, University of Colorado Boulder

/**
 * ACPowerSupply is the model for an AC power supply, used to power the electromagnet. The maximum voltage amplitude
 * and frequency are mutable, and the voltage amplitude varies over time.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import CurrentSource from './CurrentSource.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

// The minimum number of steps used to approximate one sine wave cycle.
const MIN_STEPS_PER_CYCLE = 10;

export default class ACPowerSupply extends CurrentSource {

  // Determines how high the amplitude can go. (0...1 inclusive)
  public readonly maxAmplitudeProperty: NumberProperty;

  // Determines how fast the amplitude will vary. (0...1 inclusive)
  public readonly frequencyProperty: NumberProperty;

  // The current angle of the sine wave that describes the AC (in radians)
  private readonly angleProperty: NumberProperty;

  // The change in angle at the current frequency (in radians)
  private readonly deltaAngleProperty: TReadOnlyProperty<number>;

  // The change in angle that occurred the last time stepInTime was called (in radians)
  private readonly _stepAngleProperty: NumberProperty;
  public readonly stepAngleProperty: TReadOnlyProperty<number>;

  public constructor( tandem: Tandem ) {

    super( {
      maxVoltage: 110, // volts
      tandem: tandem
    } );

    this.maxAmplitudeProperty = new NumberProperty( 0.5, {
      range: new Range( 0, 1 ),
      tandem: tandem.createTandem( 'maxAmplitudeProperty' )
    } );

    this.frequencyProperty = new NumberProperty( 0.5, {
      range: new Range( 0, 1 ),
      tandem: tandem.createTandem( 'frequencyProperty' )
    } );

    this.angleProperty = new NumberProperty( 0, {
      range: new Range( 0, 2 * Math.PI ),
      units: 'radians',
      tandem: tandem.createTandem( 'angleProperty' )
    } );

    // Reset angle when frequency is changed.
    this.frequencyProperty.link( () => {
      this.angleProperty.value = 0;
    } );

    this.deltaAngleProperty = new DerivedProperty( [ this.frequencyProperty ],
      frequency => ( 2 * Math.PI * frequency ) / MIN_STEPS_PER_CYCLE, {
        units: 'radians',
        tandem: tandem.createTandem( 'deltaAngleProperty' ),
        phetioValueType: NumberIO
      } );

    this._stepAngleProperty = new NumberProperty( 0, {
      units: 'radians',
      tandem: tandem.createTandem( 'stepAngleProperty' )
    } );
    this.stepAngleProperty = this._stepAngleProperty;
  }

  public override reset(): void {
    super.reset();
    this.maxAmplitudeProperty.reset();
    this.frequencyProperty.reset();
    this.angleProperty.reset();
    this._stepAngleProperty.reset();
  }

  /**
   * Varies the amplitude over time, based on maxAmplitude and frequency.
   * Guaranteed to hit all peaks and zero crossings.
   */
  public step( dt: number ): void {
    assert && assert( dt === 1, `invalid dt=${dt}, see FELModel step` );

    if ( this.maxAmplitudeProperty.value === 0 ) {
      this.amplitudeProperty.value = 0;
    }
    else {
      const previousAngle = this.angleProperty.value;

      // Compute the angle.
      this.angleProperty.value = previousAngle + ( dt * this.deltaAngleProperty.value );

      // The actual change in angle on this tick of the simulation clock.
      this._stepAngleProperty.value = this.angleProperty.value - previousAngle;

      // Limit the angle to 360 degrees.
      if ( this.angleProperty.value >= 2 * Math.PI ) {
        this.angleProperty.value = this.angleProperty.value % ( 2 * Math.PI );
      }

      // Calculate and set the amplitude.
      this.amplitudeProperty.value = this.maxAmplitudeProperty.value * Math.sin( this.angleProperty.value );
    }
  }
}

faradaysElectromagneticLab.register( 'ACPowerSupply', ACPowerSupply );