// Copyright 2023, University of Colorado Boulder

/**
 * Compass is the abstract base class for compass models.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Magnet from './Magnet.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {
  position?: Vector2; // initial value of positionProperty, unitless
};

export type CompassOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class Compass extends PhetioObject {

  public readonly positionProperty: Property<Vector2>; // unitless

  // The public API is readonly, while the internal API is read + write.
  public readonly rotationProperty: TReadOnlyProperty<number>; // radians
  protected readonly _rotationProperty: Property<number>;

  private readonly magnet: Magnet;
  private readonly scratchVector: Vector2;

  protected constructor( magnet: Magnet, providedOptions: CompassOptions ) {

    const options = optionize<CompassOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false
    }, providedOptions );

    super( options );

    this.magnet = magnet;
    this.scratchVector = new Vector2( 0, 0 );

    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioFeatured: true
    } );

    this._rotationProperty = new NumberProperty( 0, {
      units: 'radians',
      tandem: options.tandem.createTandem( 'rotationProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );
    this.rotationProperty = this._rotationProperty;
  }

  public reset(): void {
    this.positionProperty.reset();
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