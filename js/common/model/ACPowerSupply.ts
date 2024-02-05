// Copyright 2023-2024, University of Colorado Boulder

/**
 * ACPowerSupply is the model for an AC power supply, used to power the electromagnet. The maximum voltage and
 * frequency are mutable, and the voltage varies over time.
 *
 * This is based on ACPowerSupply.java in the Java version of this sim.
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
import ConstantDtClock from './ConstantDtClock.js';

const MAX_VOLTAGE = 110; // V
const MAX_VOLTAGE_PERCENT_RANGE = new Range( 0, 100 ); // %
const MAX_VOLTAGE_RANGE = new Range( ( MAX_VOLTAGE_PERCENT_RANGE.min / 100 ) * MAX_VOLTAGE, ( MAX_VOLTAGE_PERCENT_RANGE.max / 100 ) * MAX_VOLTAGE );

// Change in angle per step when frequency is 100%
const MAX_DELTA_ANGLE = 2 * Math.PI / 10;

export default class ACPowerSupply extends CurrentSource {

  // How high the voltage can go.
  public readonly maxVoltagePercentProperty: NumberProperty;
  public readonly maxVoltageProperty: TReadOnlyProperty<number>;

  // How fast the voltage will vary.
  public readonly frequencyProperty: NumberProperty;

  // The current angle of the sine wave that describes the AC (in radians)
  private readonly angleProperty: NumberProperty;

  // The change in angle that occurred the last time stepInTime was called (in radians)
  public readonly stepAngleProperty: TReadOnlyProperty<number>;
  private readonly _stepAngleProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    super( {
      maxVoltage: MAX_VOLTAGE, // volts
      initialVoltage: 0,
      voltagePropertyOptions: {
        phetioReadOnly: true,
        phetioHighFrequency: true
      },
      tandem: tandem
    } );

    this.maxVoltagePercentProperty = new NumberProperty( 50, {
      units: '%',
      range: MAX_VOLTAGE_PERCENT_RANGE,
      tandem: tandem.createTandem( 'maxVoltagePercentProperty' ),
      phetioFeatured: true
    } );

    this.maxVoltageProperty = new DerivedProperty( [ this.maxVoltagePercentProperty ],
      maxVoltagePercent => ( maxVoltagePercent / 100 ) * MAX_VOLTAGE, {
        isValidValue: maxVoltage => MAX_VOLTAGE_RANGE.contains( maxVoltage ),
        units: 'V',
        tandem: tandem.createTandem( 'maxVoltageProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'To change maximum voltage, use maxVoltagePercentProperty.'
      } );

    this.frequencyProperty = new NumberProperty( 50, {
      units: '%',

      // Range was [5,100] in Java version, with 100% showing 20 cycles and 5% showing 1 cycle. Showing 20 cycles
      // resulted in a very jagged-looking waveform, and was unnecessary. So we changed the range such that 100% shows
      // 10 cycles, and 10% shows 1 cycle. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/58
      range: new Range( 10, 100 ),
      tandem: tandem.createTandem( 'frequencyProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Relative frequency of the change in voltage over time.'
    } );

    this.angleProperty = new NumberProperty( 0, {
      range: new Range( 0, 2 * Math.PI ),
      units: 'radians',
      tandem: tandem.createTandem( 'angleProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.',
      phetioHighFrequency: true
    } );

    // Reset angle when frequency is changed.
    this.frequencyProperty.link( () => {
      this.angleProperty.value = 0;
    } );

    this._stepAngleProperty = new NumberProperty( 0, {
      units: 'radians',
      tandem: tandem.createTandem( 'stepAngleProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.'
    } );
    this.stepAngleProperty = this._stepAngleProperty;
  }

  public override reset(): void {
    super.reset();
    this.maxVoltagePercentProperty.reset();
    this.frequencyProperty.reset();
    this.angleProperty.reset();
    this._stepAngleProperty.reset();
  }

  /**
   * Varies the amplitude over time. Guaranteed to hit all peaks and zero crossings.
   */
  public step( dt: number ): void {
    assert && assert( dt === ConstantDtClock.CONSTANT_DT, `invalid dt=${dt}, see ConstantStepEmitter` );

    if ( this.maxVoltageProperty.value === 0 ) {
      this.voltageProperty.value = 0;
    }
    else {
      const deltaAngle = ( this.frequencyProperty.value / 100 ) * MAX_DELTA_ANGLE;
      const previousAngle = this.angleProperty.value;

      // Compute the next angle.
      const nextAngle = previousAngle + deltaAngle;

      // The change in angle on this tick of the simulation clock.
      this._stepAngleProperty.value = nextAngle - previousAngle;

      // Limit the angle to 360 degrees.
      this.angleProperty.value = nextAngle % ( 2 * Math.PI );

      // Calculate and set the voltage.
      this.voltageProperty.value = this.maxVoltageProperty.value * Math.sin( this.angleProperty.value );
    }
  }
}

faradaysElectromagneticLab.register( 'ACPowerSupply', ACPowerSupply );