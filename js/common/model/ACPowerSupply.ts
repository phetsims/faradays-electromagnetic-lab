// Copyright 2023-2024, University of Colorado Boulder

/**
 * ACPowerSupply is the model for an AC power supply, used to power an electromagnet. The maximum voltage and
 * frequency are mutable, and the voltage varies over time.
 *
 * This is based on ACPowerSupply.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import ConstantDtClock from './ConstantDtClock.js';
import CurrentSource from './CurrentSource.js';

const MAX_VOLTAGE_RANGE = new Range( 0, 110 ); // V
const MAX_VOLTAGE_PERCENT_RANGE = new Range( 0, 100 ); // %

// Number of waveform cycles to display when frequencyPercentProperty is 100%.
// This was 20 in the Java version, but looked very jagged. We decreased to smooth it out.
const MAX_CYCLES = 10;

// Change in angle per step when frequency is 100%. Increase the denominator to slow the oscillation.
const MAX_DELTA_ANGLE = 2 * Math.PI / 20;

export default class ACPowerSupply extends CurrentSource {

  // How high the voltage can go.
  public readonly maxVoltagePercentProperty: NumberProperty;
  public readonly maxVoltageProperty: TReadOnlyProperty<number>;

  // How fast the voltage will vary.
  public readonly frequencyPercentProperty: NumberProperty;

  // Number of cycles to display, [1,MAX_CYCLES].
  private readonly numberOfCyclesProperty: TReadOnlyProperty<number>;

  // The current angle on the cycles of sine waves that are displayed.
  public readonly angleProperty: TReadOnlyProperty<number>;
  private readonly _angleProperty: NumberProperty;
  public readonly maxAngleRange: Range;

  // Angle range computing voltage. This is based on an integer number of cycles. It's centered on the max range,
  // so that there is a zero crossing at the center of the range, and increasing the frequency makes the waveform
  // appear to grow out from the center.  This is also the angle that voltmeter's cursor follows.
  private readonly angleRangeProperty: TReadOnlyProperty<Range>;

  // Angle range for the portion of the waveform that is visible on the AC Power supply's display.
  // Like angleRangeProperty, but derived from the actual number of cycles (non-integer), which may include a partial cycle.
  public readonly visibleAngleRangeProperty: TReadOnlyProperty<Range>;

  public constructor( tandem: Tandem ) {

    super( {
      maxVoltage: MAX_VOLTAGE_RANGE.max, // volts
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
      maxVoltagePercent => ( maxVoltagePercent / 100 ) * MAX_VOLTAGE_RANGE.max, {
        isValidValue: maxVoltage => MAX_VOLTAGE_RANGE.contains( maxVoltage ),
        units: 'V',
        tandem: tandem.createTandem( 'maxVoltageProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'To change maximum voltage, use maxVoltagePercentProperty.'
      } );

    this.frequencyPercentProperty = new NumberProperty( 50, {
      units: '%',

      // Range was [5,100] in Java version, with 100% showing 20 cycles and 5% showing 1 cycle. Showing 20 cycles
      // resulted in a very jagged-looking waveform, and was unnecessary. So we changed the range such that 100% shows
      // 10 cycles, and 10% shows 1 cycle. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/58
      range: new Range( 10, 100 ),
      tandem: tandem.createTandem( 'frequencyPercentProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Relative frequency of the change in voltage over time. Frequency is qualitative.'
    } );

    this.numberOfCyclesProperty = new DerivedProperty( [ this.frequencyPercentProperty ],
      frequencyPercent => ( frequencyPercent / 100 ) * MAX_CYCLES, {
        isValidValue: value => value >= 1 && value <= MAX_CYCLES
      } );

    this.maxAngleRange = new Range( 0, 2 * Math.PI * MAX_CYCLES );

    this.angleRangeProperty = new DerivedProperty( [ this.numberOfCyclesProperty ], numberOfCycles => {
      const middle = this.maxAngleRange.getCenter();
      const offset = Math.PI * Math.ceil( numberOfCycles ); // complete cycles, hence Math.ceil
      return new Range( middle - offset, middle + offset );
    } );

    this.visibleAngleRangeProperty = new DerivedProperty( [ this.numberOfCyclesProperty ], numberOfCycles => {
      const middle = this.maxAngleRange.getCenter();
      const offset = Math.PI * numberOfCycles;
      return new Range( middle - offset, middle + offset );
    } );

    this._angleProperty = new NumberProperty( this.angleRangeProperty.value.min, {
      range: this.maxAngleRange,
      units: 'radians',
      tandem: tandem.createTandem( 'angleProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.',
      phetioHighFrequency: true
    } );
    this.angleProperty = this._angleProperty;

    // Reset the angle to the minimum whenever the governing characteristics change
    Multilink.multilink( [ this.maxVoltagePercentProperty, this.angleRangeProperty ],
      ( maxVoltagePercent, angleRange ) => {
        this._angleProperty.value = angleRange.min;
      } );
  }

  public override reset(): void {
    super.reset();
    this.maxVoltagePercentProperty.reset();
    this.frequencyPercentProperty.reset();
    this._angleProperty.reset();
  }

  /**
   * Varies the voltage over time.
   */
  public step( dt: number ): void {
    assert && assert( dt === ConstantDtClock.DT, `invalid dt=${dt}` );

    // Change in angle is a function of relative frequency.
    const deltaAngle = dt * ( this.frequencyPercentProperty.value / 100 ) * MAX_DELTA_ANGLE;

    // New angle, with wrap around.
    const angleRange = this.angleRangeProperty.value;
    let newAngle = ( this._angleProperty.value + deltaAngle );
    if ( newAngle > angleRange.max ) {
      newAngle = angleRange.min + ( newAngle - angleRange.max );
    }
    this._angleProperty.value = newAngle;

    // Voltage varies with the sine of the angle.
    this.voltageProperty.value = this.maxVoltageProperty.value * Math.sin( this._angleProperty.value );
  }
}

faradaysElectromagneticLab.register( 'ACPowerSupply', ACPowerSupply );