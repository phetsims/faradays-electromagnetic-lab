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
  maxVoltage: number; // range of voltageProperty is [-maxVoltage,maxVoltage]
  initialVoltage: number; // initial value of voltageProperty
  voltagePropertyOptions?: NumberPropertyOptions;
};

export type CurrentSourceOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CurrentSource extends PhetioObject {

  public readonly voltageProperty: NumberProperty;

  // Amplitude of the current, relative to the voltage. See Coil currentAmplitudeProperty.
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
      voltage => linearRange( voltageRange, FELConstants.CURRENT_AMPLITUDE_RANGE, voltage ), {
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

//TODO Move to dot.Utils or FELUtils
function linearRange( aRange: Range, bRange: Range, aValue: number ): number {
  return Utils.linear( aRange.min, aRange.max, bRange.min, bRange.max, aValue );
}

faradaysElectromagneticLab.register( 'CurrentSource', CurrentSource );