// Copyright 2023-2024, University of Colorado Boulder

/**
 * ACPowerSupply is the model for an AC power supply, used to power the electromagnet. The maximum voltage and
 * frequency are mutable, and the voltage varies over time.
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
import ConstantStepEmitter from './ConstantStepEmitter.js';

const MAX_VOLTAGE = 110; // V
const MAX_VOLTAGE_PERCENT_RANGE = new Range( 0, 100 ); // %
const MAX_VOLTAGE_RANGE = new Range( ( MAX_VOLTAGE_PERCENT_RANGE.min / 100 ) * MAX_VOLTAGE, ( MAX_VOLTAGE_PERCENT_RANGE.max / 100 ) * MAX_VOLTAGE );

// The minimum number of steps used to approximate one sine wave cycle.
const MIN_STEPS_PER_CYCLE = 10;

export default class ACPowerSupply extends CurrentSource {

  // How high the voltage can go.
  public readonly maxVoltagePercentProperty: NumberProperty;
  public readonly maxVoltageProperty: TReadOnlyProperty<number>;

  // How fast the voltage will vary.
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
        phetioDocumentation: 'To change maximum voltage, use maxVoltagePercentProperty'
      } );

    this.frequencyProperty = new NumberProperty( 50, {
      units: '%',
      // range was [5,100] in Java version, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/58
      range: new Range( 10, 100 ),
      tandem: tandem.createTandem( 'frequencyProperty' ),
      phetioFeatured: true
    } );

    this.angleProperty = new NumberProperty( 0, {
      range: new Range( 0, 2 * Math.PI ),
      units: 'radians',
      tandem: tandem.createTandem( 'angleProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.',
      phetioHighFrequency: true
    } );

    this.deltaAngleProperty = new DerivedProperty( [ this.frequencyProperty ],
      frequencyPercent => ( 2 * Math.PI * frequencyPercent / 100 ) / MIN_STEPS_PER_CYCLE, {
        units: 'radians',
        tandem: tandem.createTandem( 'deltaAngleProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'For internal use only.'
      } );

    // Reset angle when delta angle is changed.
    this.deltaAngleProperty.link( () => {
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
    assert && assert( dt === ConstantStepEmitter.CONSTANT_DT, `invalid dt=${dt}, see ConstantStepEmitter` );

    if ( this.maxVoltageProperty.value === 0 ) {
      this.voltageProperty.value = 0;
    }
    else {
      const previousAngle = this.angleProperty.value;

      // Compute the next angle.
      const nextAngle = previousAngle + ( dt * this.deltaAngleProperty.value );

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