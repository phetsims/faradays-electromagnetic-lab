// Copyright 2023, University of Colorado Boulder

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
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = {
  amplitude?: number; // the amplitude of the current, [-1,1]
  maxVoltage?: number; // the voltage when amplitude === 1
};

export type CurrentSourceOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CurrentSource extends PhetioObject {

  public readonly amplitudeProperty: NumberProperty;
  public readonly voltageProperty: TReadOnlyProperty<number>;

  protected constructor( providedOptions: CurrentSourceOptions ) {

    const options = optionize<CurrentSourceOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      amplitude: 0,
      maxVoltage: 1,

      // PhetioObjectOptions
      isDisposable: false,
      phetioType: CurrentSource.CurrentSourceIO,
      phetioState: false
    }, providedOptions );

    assert && assert( options.maxVoltage > 0, `invalid maxVoltage: ${options.maxVoltage}` );

    super( options );

    this.amplitudeProperty = new NumberProperty( options.amplitude, {
      range: new Range( -1, 1 ),
      tandem: options.tandem.createTandem( 'amplitudeProperty' ),
      phetioFeatured: true
      //TODO phetioReadOnly?
    } );

    this.voltageProperty = new DerivedProperty( [ this.amplitudeProperty ],
      amplitude => amplitude * options.maxVoltage, {
        phetioValueType: NumberIO,
        isValidValue: voltage => ( voltage >= -options.maxVoltage && voltage <= options.maxVoltage ),
        tandem: options.tandem.createTandem( 'voltageProperty' ),
        phetioFeatured: true
      } );
  }

  public reset(): void {
    this.amplitudeProperty.reset();
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