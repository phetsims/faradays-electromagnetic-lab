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

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty, { NumberPropertyOptions } from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELConstants from '../FELConstants.js';

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
  public readonly voltageProperty: NumberProperty;

  // Normalized current, relative to the voltage. See Coil normalizedCurrentProperty.
  public readonly normalizedCurrentProperty: TReadOnlyProperty<number>;

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

    // Normalized current is a linear mapping from voltage. We are considering resistance to be constant.
    this.normalizedCurrentProperty = new DerivedProperty( [ this.voltageProperty ],
      voltage => Utils.linear( voltageRange.min, voltageRange.max, FELConstants.NORMALIZED_CURRENT_RANGE.min, FELConstants.NORMALIZED_CURRENT_RANGE.max, voltage ), {
        isValidValue: normalizedCurrent => FELConstants.NORMALIZED_CURRENT_RANGE.contains( normalizedCurrent )
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
  public static readonly CurrentSourceIO = new IOType<IntentionalAny, IntentionalAny>( 'CurrentSourceIO', {
    valueType: CurrentSource,
    supertype: ReferenceIO( IOType.ObjectIO ),
    documentation: 'A device that acts as the current source for an electromagnet'
  } );
}

faradaysElectromagneticLab.register( 'CurrentSource', CurrentSource );