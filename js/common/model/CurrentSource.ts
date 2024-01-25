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
import FELConstants from '../FELConstants.js';

type SelfOptions = {
  maxVoltage: number; // range of voltageProperty is [-maxVoltage,maxVoltage]
};

export type CurrentSourceOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CurrentSource extends PhetioObject {

  // Amplitude of the current, relative to the voltage. See Coil currentAmplitudeProperty.
  public readonly currentAmplitudeProperty: TReadOnlyProperty<number>;

  protected constructor( voltageProperty: TReadOnlyProperty<number>, providedOptions: CurrentSourceOptions ) {

    const options = optionize<CurrentSourceOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      isDisposable: false,
      phetioType: CurrentSource.CurrentSourceIO,
      phetioState: false,
      phetioFeatured: true
    }, providedOptions );

    assert && assert( options.maxVoltage > 0, `invalid maxVoltage: ${options.maxVoltage}` );

    super( options );

    this.currentAmplitudeProperty = new DerivedProperty( [ voltageProperty ],
      voltage => voltage / options.maxVoltage, {
        isValidValue: currentAmplitude => FELConstants.CURRENT_AMPLITUDE_RANGE.contains( currentAmplitude )
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