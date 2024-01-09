// Copyright 2023-2024, University of Colorado Boulder

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
import FELModel from './FELModel.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import MappedProperty from '../../../../axon/js/MappedProperty.js';

// The minimum number of steps used to approximate one sine wave cycle.
const MIN_STEPS_PER_CYCLE = 10;

export default class ACPowerSupply extends CurrentSource {

  // Determines how high the voltage can go.
  public readonly maxVoltageProperty: NumberProperty;
  public readonly maxVoltagePercentProperty: PhetioProperty<number>;
  public readonly maxVoltagePercentRange: Range;

  // Determines how fast the amplitude will vary.
  public readonly frequencyProperty: NumberProperty;
  public readonly frequencyPercentProperty: PhetioProperty<number>;
  public readonly frequencyPercentRange: Range;

  // The current angle of the sine wave that describes the AC (in radians)
  private readonly angleProperty: NumberProperty;

  // The change in angle at the current frequency (in radians)
  private readonly deltaAngleProperty: TReadOnlyProperty<number>;

  // The change in angle that occurred the last time stepInTime was called (in radians)
  private readonly _stepAngleProperty: NumberProperty;
  public readonly stepAngleProperty: TReadOnlyProperty<number>;

  public constructor( tandem: Tandem ) {

    const options = {
      maxVoltage: 110, // volts
      initialVoltage: 55, // volts
      voltagePropertyReadOnly: true, // because voltage is varied over time by the power supply
      tandem: tandem
    };

    super( options );

    this.maxVoltageProperty = new NumberProperty( options.initialVoltage, {
      range: new Range( 0, options.maxVoltage ),
      tandem: tandem.createTandem( 'maxVoltageProperty' ),
      phetioFeatured: true
    } );

    this.maxVoltagePercentRange = new Range( 100 * this.maxVoltageProperty.range.min / this.maxVoltageProperty.range.max, 100 );

    this.maxVoltagePercentProperty = new MappedProperty<number, number>( this.maxVoltageProperty, {
      bidirectional: true,
      map: ( maxVoltage: number ) => 100 * maxVoltage / this.maxVoltageProperty.range.max,
      inverseMap: ( percent: number ) => percent * this.maxVoltageProperty.range.max / 100,
      isValidValue: percent => this.maxVoltagePercentRange.contains( percent ),
      tandem: options.tandem.createTandem( 'maxVoltagePercentProperty' ),
      phetioValueType: NumberIO,
      phetioReadOnly: true, // use maxVoltageProperty
      phetioDocumentation: 'Max voltage as a percentage, which is how the UI sets and views it. ' +
                           'If you want to change this, use the sim or see maxVoltageProperty.'
    } );

    this.frequencyProperty = new NumberProperty( 0.5, {
      range: new Range( 0.05, 1 ),
      tandem: tandem.createTandem( 'frequencyProperty' ),
      phetioFeatured: true
    } );

    this.frequencyPercentRange = new Range( 100 * this.frequencyProperty.range.min / this.frequencyProperty.range.max, 100 );

    this.frequencyPercentProperty = new MappedProperty<number, number>( this.frequencyProperty, {
      bidirectional: true,
      map: ( frequency: number ) => 100 * frequency / this.frequencyProperty.range.max,
      inverseMap: ( percent: number ) => percent * this.frequencyProperty.range.max / 100,
      isValidValue: percent => this.frequencyPercentRange.contains( percent ),
      tandem: options.tandem.createTandem( 'frequencyPercentProperty' ),
      phetioValueType: NumberIO,
      phetioReadOnly: true, // use loopAreaProperty
      phetioDocumentation: 'Frequency as a percentage, which is how the UI sets and views it. ' +
                           'If you want to change this, use the sim or see frequencyProperty.'
    } );

    this.angleProperty = new NumberProperty( 0, {
      range: new Range( 0, 2 * Math.PI ),
      units: 'radians',
      tandem: tandem.createTandem( 'angleProperty' ),
      phetioReadOnly: true
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
      tandem: tandem.createTandem( 'stepAngleProperty' ),
      phetioReadOnly: true
    } );
    this.stepAngleProperty = this._stepAngleProperty;
  }

  public override reset(): void {
    super.reset();
    this.maxVoltageProperty.reset();
    this.frequencyProperty.reset();
    this.angleProperty.reset();
    this._stepAngleProperty.reset();
  }

  /**
   * Varies the amplitude over time. Guaranteed to hit all peaks and zero crossings.
   */
  public step( dt: number ): void {
    assert && assert( dt === FELModel.CONSTANT_DT, `invalid dt=${dt}, see FELModel step` );

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