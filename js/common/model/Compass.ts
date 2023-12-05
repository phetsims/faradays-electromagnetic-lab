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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import FELMovable, { FELMovableOptions } from './FELMovable.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  visible?: boolean;
};

export type CompassOptions = SelfOptions & FELMovableOptions;

export default abstract class Compass extends FELMovable {

  // The public API is readonly, while the internal API is read + write.
  public readonly rotationProperty: TReadOnlyProperty<number>; // radians
  protected readonly _rotationProperty: Property<number>;

  public readonly visibleProperty: Property<boolean>;

  private readonly magnet: Magnet;

  // A reusable vector instance, for getting the field vector value at the compass' position
  private readonly reusableFieldVector: Vector2;

  protected constructor( magnet: Magnet, providedOptions: CompassOptions ) {

    const options = optionize<CompassOptions, SelfOptions, FELMovableOptions>()( {

      //SelfOptions
      visible: true
    }, providedOptions );

    super( options );

    this.magnet = magnet;
    this.reusableFieldVector = new Vector2( 0, 0 );

    this._rotationProperty = new NumberProperty( 0, {
      units: 'radians',
      tandem: options.tandem.createTandem( 'rotationProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );
    this.rotationProperty = this._rotationProperty;

    this.visibleProperty = new BooleanProperty( options.visible, {
      tandem: options.tandem.createTandem( 'visibleProperty' )
    } );
  }

  public override reset(): void {
    super.reset();
    this._rotationProperty.reset();
    this.visibleProperty.reset();
  }

  //TODO If the clock is paused and the magnet moves, update immediately to match the field vector
  public step( dt: number ): void {
    const fieldVector = this.magnet.getFieldVector( this.positionProperty.value, this.reusableFieldVector );
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
  public startMovingNow(): void {
    // The default behavior is to do nothing.
  }
}

faradaysElectromagneticLab.register( 'Compass', Compass );