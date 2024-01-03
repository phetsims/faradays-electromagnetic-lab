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
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {
  initialVoltage: number; // initial value of voltageProperty
  maxVoltage: number; // range of voltageProperty is [-maxVoltage,maxVoltage]
  voltagePropertyReadOnly?: boolean; // phetioReadOnly value for voltageProperty
};

export type CurrentSourceOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CurrentSource extends PhetioObject {

  // Voltage of the current source
  public readonly voltageProperty: NumberProperty;

  // Amplitude [-1,1] relative to the range of voltageProperty.
  public readonly amplitudeProperty: TReadOnlyProperty<number>;

  protected constructor( providedOptions: CurrentSourceOptions ) {

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

    this.voltageProperty = new NumberProperty( options.initialVoltage, {
      range: new Range( -options.maxVoltage, options.maxVoltage ),
      tandem: options.tandem.createTandem( 'voltageProperty' ),
      phetioFeatured: true,
      phetioReadOnly: options.voltagePropertyReadOnly
    } );

    this.amplitudeProperty = new DerivedProperty( [ this.voltageProperty ],
      voltage => voltage / options.maxVoltage, {
        isValidValue: amplitude => ( amplitude >= -1 && amplitude <= 1 ) // [-1,1]
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