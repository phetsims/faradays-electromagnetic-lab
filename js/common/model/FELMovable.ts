// Copyright 2023, University of Colorado Boulder

/**
 * FELMovable is the abstract base class for model elements that have a mutable position.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';

type SelfOptions = {
  position?: Vector2; // initial value of positionProperty, unitless
};

export type FELMovableOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class FELMovable extends PhetioObject {

  public readonly positionProperty: Property<Vector2>; // unitless

  protected constructor( providedOptions: FELMovableOptions ) {

    const options = optionize<FELMovableOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false,
      phetioFeatured: true
    }, providedOptions );

    super( options );

    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.positionProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'FELMovable', FELMovable );