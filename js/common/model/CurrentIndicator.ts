// Copyright 2023-2025, University of Colorado Boulder

/**
 * CurrentIndicator is the base class for devices that indicate the presence of induced EMF in the pickup coil.
 * It exists only to set PhET-iO metadata and provide CurrentIndicatorIO for reference-type serialization.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

type SelfOptions = EmptySelfOptions;

export type CurrentIndicatorOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CurrentIndicator extends PhetioObject {

  protected constructor( providedOptions: CurrentIndicatorOptions ) {

    const options = optionize<CurrentIndicatorOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      isDisposable: false,
      phetioType: CurrentIndicator.CurrentIndicatorIO,
      phetioState: false,
      phetioFeatured: true
    }, providedOptions );

    super( options );
  }

  /**
   * CurrentIndicatorIO handles PhET-iO serialization of CurrentIndicator. Since all CurrentIndicator are created at
   * startup and exist for the lifetime of the simulation, it implements 'Reference type serialization', as described
   * in the Serialization section of https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly CurrentIndicatorIO = new IOType<IntentionalAny, IntentionalAny>( 'CurrentIndicatorIO', {
    valueType: CurrentIndicator,
    supertype: ReferenceIO( IOType.ObjectIO ),
    documentation: 'A device that indicates the presence of current in the pickup coil'
  } );
}

faradaysElectromagneticLab.register( 'CurrentIndicator', CurrentIndicator );