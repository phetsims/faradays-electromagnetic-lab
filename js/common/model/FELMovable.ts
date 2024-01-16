// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELMovable is the base class for model elements that have a mutable position.
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

type SelfOptions = {
  position?: Vector2; // initial value of positionProperty, unitless
  positionPropertyOptions?: Vector2PropertyOptions;
};

export type FELMovableOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

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

  public reset(): void {
    this.positionProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'FELMovable', FELMovable );