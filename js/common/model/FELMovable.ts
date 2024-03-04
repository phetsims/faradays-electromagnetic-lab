// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELMovable is the base class for model elements that have a mutable position.
 *
 * This is based on FaradayObservable.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Vector2Property, { Vector2PropertyOptions } from '../../../../dot/js/Vector2Property.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = {

  // Initial value of positionProperty, unitless
  position?: Vector2;

  // Options passed to positionProperty
  positionPropertyOptions?: Vector2PropertyOptions;
};

export type FELMovableOptions = SelfOptions &
  PickOptional<PhetioObjectOptions, 'phetioDocumentation'> &
  PickRequired<PhetioObjectOptions, 'tandem'>;

export default class FELMovable extends PhetioObject {

  public readonly positionProperty: Property<Vector2>; // unitless

  protected constructor( providedOptions: FELMovableOptions ) {

    const options = optionize<FELMovableOptions, StrictOmit<SelfOptions, 'positionPropertyOptions'>, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false,
      phetioFeatured: true
    }, providedOptions );

    super( options );

    this.positionProperty = new Vector2Property( options.position, combineOptions<Vector2PropertyOptions>( {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioFeatured: true
    }, options.positionPropertyOptions ) );
  }

  protected reset(): void {
    this.positionProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'FELMovable', FELMovable );