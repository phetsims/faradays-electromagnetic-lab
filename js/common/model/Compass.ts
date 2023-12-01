// Copyright 2023, University of Colorado Boulder

/**
 * Compass is the abstract base class for compass models.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Magnet from './Magnet.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import FELMovable, { FELMovableOptions } from './FELMovable.js';

type SelfOptions = EmptySelfOptions;

export type CompassOptions = SelfOptions & FELMovableOptions;

export default abstract class Compass extends FELMovable {

  // The public API is readonly, while the internal API is read + write.
  public readonly rotationProperty: TReadOnlyProperty<number>; // radians
  protected readonly _rotationProperty: Property<number>;

  private readonly magnet: Magnet;
  private readonly scratchVector: Vector2;

  protected constructor( magnet: Magnet, providedOptions: CompassOptions ) {

    const options = providedOptions;

    super( options );

    this.magnet = magnet;
    this.scratchVector = new Vector2( 0, 0 );

    this._rotationProperty = new NumberProperty( 0, {
      units: 'radians',
      tandem: options.tandem.createTandem( 'rotationProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );
    this.rotationProperty = this._rotationProperty;
  }

  public override reset(): void {
    super.reset();
    this._rotationProperty.reset();
  }

  //TODO If the clock is paused and the magnet moves, update immediately to match the field vector
  public step( dt: number ): void {
    const fieldVector = this.magnet.getFieldVector( this.positionProperty.value, this.scratchVector );
    if ( fieldVector.magnitude !== 0 ) {
      this.updateRotation( fieldVector, dt );
    }
  }

  /**
   * Updates the compass needle's rotation.
   * @param fieldVector - the magnet's B-field vector at the compass position
   * @param dt - time step, in seconds
   */
  protected abstract updateRotation( fieldVector: Vector2, dt: number ): void;

  /**
   * Starts the compass needle moving immediately.
   */
  public abstract startMovingNow(): void;
}

faradaysElectromagneticLab.register( 'Compass', Compass );