// Copyright 2023-2024, University of Colorado Boulder

/**
 * CurrentSource is the base class for all devices that are capable of acting as a current source for an electromagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';

const AMPLITUDE_RANGE = new Range( -1, 1 );

type SelfOptions = {
  maxVoltage: number; // range of voltageProperty is [-maxVoltage,maxVoltage]
  voltagePropertyReadOnly?: boolean; // phetioReadOnly value for voltageProperty
};

export type CurrentSourceOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CurrentSource extends PhetioObject {

  // Amplitude [-1,1] relative to the range of voltageProperty.
  public readonly amplitudeProperty: TReadOnlyProperty<number>;

  protected constructor( voltageProperty: TReadOnlyProperty<number>, providedOptions: CurrentSourceOptions ) {

    const options = optionize<CurrentSourceOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      voltagePropertyReadOnly: false,

      // PhetioObjectOptions
      isDisposable: false,
      phetioType: CurrentSource.CurrentSourceIO,
      phetioState: false
    }, providedOptions );

    assert && assert( options.maxVoltage > 0, `invalid maxVoltage: ${options.maxVoltage}` );

    super( options );

    this.amplitudeProperty = new DerivedProperty( [ voltageProperty ],
      voltage => voltage / options.maxVoltage, {
        isValidValue: amplitude => AMPLITUDE_RANGE.contains( amplitude )
      } );
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