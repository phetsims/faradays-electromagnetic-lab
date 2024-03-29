// Copyright 2023-2024, University of Colorado Boulder

/**
 * CurrentSource is the base class for all devices that are capable of acting as a source of electrical current
 * for an electromagnet. It provides CurrentSourceIO for reference-type serialization.
 *
 * This is regrettably named CurrentSource instead of PowerSupply because the UI label is 'Current Source',
 * and (by convention) that naming is exposed in PhET-iO.
 *
 * This is based on AbstractCurrentSource.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import FELConstants from '../FELConstants.js';
import NumberProperty, { NumberPropertyOptions } from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Utils from '../../../../dot/js/Utils.js';

type SelfOptions = {

  // Range of voltageProperty will be [-maxVoltage,maxVoltage]
  maxVoltage: number;

  // Initial value of voltageProperty
  initialVoltage: number;

  // Options passed to voltagePropertyOptions
  voltagePropertyOptions?: StrictOmit<NumberPropertyOptions, 'units' | 'range'>;
};

export type CurrentSourceOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CurrentSource extends PhetioObject {

  // Voltage that will cause current flow
  // REVIEW - Can this be currentProperty? See https://github.com/phetsims/faradays-electromagnetic-lab/issues/118 CM: This is voltage. There is no current in this model.
  public readonly voltageProperty: NumberProperty;

  // Amplitude of the current, relative to the voltage. See Coil currentAmplitudeProperty.
  // REVIEW - It's unclear how current and voltage are related here without any mention of resistance. Can this just be based on current? CM: There is no current or resistance in this model.
  public readonly currentAmplitudeProperty: TReadOnlyProperty<number>;

  protected constructor( providedOptions: CurrentSourceOptions ) {

    const options = optionize<CurrentSourceOptions, StrictOmit<SelfOptions, 'voltagePropertyOptions'>, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      isDisposable: false,
      phetioType: CurrentSource.CurrentSourceIO,
      phetioState: false,
      phetioFeatured: true
    }, providedOptions );

    assert && assert( options.maxVoltage > 0, `invalid maxVoltage: ${options.maxVoltage}` );

    super( options );

    const voltageRange = new Range( -options.maxVoltage, options.maxVoltage );

    this.voltageProperty = new NumberProperty( options.initialVoltage,
      combineOptions<NumberPropertyOptions>( {
        units: 'V',
        range: voltageRange,
        tandem: options.tandem.createTandem( 'voltageProperty' ),
        phetioFeatured: true
      }, options.voltagePropertyOptions ) );

    this.currentAmplitudeProperty = new DerivedProperty( [ this.voltageProperty ],

      // REVIEW - If you decide to stick with this approach, please explain how current and voltage are related.  CM: There is no current in this model.
      // REVIEW - Adding another coil will change the resistance, but also the EMF induced, resulting in the same current. Should this be mentioned in the documentation? CM: There is no resistance in this model, see model.md.
      // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/118
      voltage => Utils.linear( voltageRange.min, voltageRange.max, FELConstants.CURRENT_AMPLITUDE_RANGE.min, FELConstants.CURRENT_AMPLITUDE_RANGE.max, voltage ), {
        isValidValue: currentAmplitude => FELConstants.CURRENT_AMPLITUDE_RANGE.contains( currentAmplitude )
      } );
  }

  public reset(): void {
    this.voltageProperty.reset();
  }

  /**
   * CurrentSourceIO handles PhET-iO serialization of CurrentSource. Since all CurrentSource are created at startup and
   * exist for the lifetime of the simulation, it implements 'Reference type serialization', as described in the
   * Serialization section of https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly CurrentSourceIO = new IOType( 'CurrentSourceIO', {
    valueType: CurrentSource,
    supertype: ReferenceIO( IOType.ObjectIO ),
    documentation: 'A device that acts as the current source for an electromagnet'
  } );
}

faradaysElectromagneticLab.register( 'CurrentSource', CurrentSource );