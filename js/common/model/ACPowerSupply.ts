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
import Multilink from '../../../../axon/js/Multilink.js';

const MAX_VOLTAGE = 110; // V
const MAX_VOLTAGE_PERCENT_RANGE = new Range( 0, 100 ); // %
const MAX_VOLTAGE_RANGE = new Range( ( MAX_VOLTAGE_PERCENT_RANGE.min / 100 ) * MAX_VOLTAGE, ( MAX_VOLTAGE_PERCENT_RANGE.max / 100 ) * MAX_VOLTAGE );

// Change in angle per step when frequency is 100%. Increase the denominator to slow the oscillation.
const MAX_DELTA_ANGLE = 2 * Math.PI / 20;

export default class ACPowerSupply extends CurrentSource {

  // Number of cycles to display. This was 20 in the Java version, but looked very jagged. We decreased to smooth it out.
  public static readonly MAX_CYCLES = 10;

  // How high the voltage can go.
  public readonly maxVoltagePercentProperty: NumberProperty;
  public readonly maxVoltageProperty: TReadOnlyProperty<number>;

  // How fast the voltage will vary.
  public readonly frequencyProperty: NumberProperty;

  // Number of cycles to display, [1,MAX_CYCLES].
  public readonly numberOfCyclesProperty: TReadOnlyProperty<number>;

  // The current angle on the cycles of sine waves that are displayed.
  public readonly angleProperty: TReadOnlyProperty<number>;
  private readonly _angleProperty: NumberProperty;

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

    //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/59 Should numberOfCyclesProperty be an integer?
    this.numberOfCyclesProperty = new DerivedProperty( [ this.frequencyProperty ],
      frequency => ACPowerSupply.MAX_CYCLES * frequency / 100, {
        isValidValue: value => value >= 1 && value <= ACPowerSupply.MAX_CYCLES
      } );

    this._angleProperty = new NumberProperty( 0, {
      range: new Range( 0, 2 * Math.PI * ACPowerSupply.MAX_CYCLES ),
      units: 'radians',
      tandem: tandem.createTandem( 'angleProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.',
      phetioHighFrequency: true
    } );
    this.angleProperty = this._angleProperty;

    Multilink.multilink( [ this.maxVoltagePercentProperty, this.numberOfCyclesProperty ], () => {
      this._angleProperty.reset();
    } );
  }

  public override reset(): void {
    super.reset();
    this.maxVoltagePercentProperty.reset();
    this.frequencyProperty.reset();
    this._angleProperty.reset();
  }

  /**
   * Varies the voltage over time.
   */
  public step( dt: number ): void {
    assert && assert( dt === ConstantDtClock.CONSTANT_DT, `invalid dt=${dt}, see ConstantStepEmitter` );

    // Change in angle is a function of relative frequency.
    const deltaAngle = dt * ( this.frequencyProperty.value / 100 ) * MAX_DELTA_ANGLE;

    // The angle must range over complete cycles, hence Math.ceil.
    const maxAngle = 2 * Math.PI * Math.ceil( this.numberOfCyclesProperty.value );
    this._angleProperty.value = ( this._angleProperty.value + deltaAngle ) % maxAngle;

    // Voltage varies with the sine of the angle.
    this.voltageProperty.value = this.maxVoltageProperty.value * Math.sin( this._angleProperty.value );
  }
}

faradaysElectromagneticLab.register( 'ACPowerSupply', ACPowerSupply );