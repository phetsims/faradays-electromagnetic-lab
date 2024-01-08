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
import Multilink from '../../../../axon/js/Multilink.js';

type SelfOptions = {
  visible?: boolean;
};

export type CompassOptions = SelfOptions & FELMovableOptions;

export default abstract class Compass extends FELMovable {

  // The public API is readonly, while the internal API is read + write.
  public readonly angleProperty: TReadOnlyProperty<number>; // radians
  protected readonly _angleProperty: Property<number>;

  public readonly visibleProperty: Property<boolean>;

  private readonly magnet: Magnet;

  // A reusable vector instance, for getting the field vector value at the compass' position
  private readonly reusableFieldVector: Vector2;

  protected constructor( magnet: Magnet, isPlayingProperty: TReadOnlyProperty<boolean>, providedOptions: CompassOptions ) {

    const options = optionize<CompassOptions, SelfOptions, FELMovableOptions>()( {

      //SelfOptions
      visible: true
    }, providedOptions );

    super( options );

    this.magnet = magnet;
    this.reusableFieldVector = new Vector2( 0, 0 );

    this._angleProperty = new NumberProperty( 0, {
      units: 'radians',
      tandem: options.tandem.createTandem( 'angleProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioDocumentation: 'Angle of the compass needle'
    } );
    this.angleProperty = this._angleProperty;

    this.visibleProperty = new BooleanProperty( options.visible, {
      tandem: options.tandem.createTandem( 'visibleProperty' ),
      phetioFeatured: true
    } );

    // If the clock is paused, update immediately to match the field vector.
    Multilink.multilink( [ magnet.strengthProperty, magnet.positionProperty, magnet.rotationProperty ], () => {
      if ( !isPlayingProperty.value ) {
        const fieldVector = this.magnet.getFieldVector( this.positionProperty.value, this.reusableFieldVector );
        this._angleProperty.value = fieldVector.angle;
      }
    } );
  }

  public override reset(): void {
    super.reset();
    this._angleProperty.reset();
    this.visibleProperty.reset();
  }

  public step( dt: number ): void {
    assert && assert( dt === 1, `invalid dt=${dt}, see FELModel step` );

    const fieldVector = this.magnet.getFieldVector( this.positionProperty.value, this.reusableFieldVector );
    if ( fieldVector.magnitude !== 0 ) {
      this.updateAngle( fieldVector, dt );
    }
  }

  /**
   * Updates the compass needle's angle.
   * @param fieldVector - the magnet's B-field vector at the compass position
   * @param dt - time step, in seconds
   */
  protected abstract updateAngle( fieldVector: Vector2, dt: number ): void;

  /**
   * Starts the compass needle moving immediately.
   */
  public startMovingNow(): void {
    // The default behavior is to do nothing.
  }
}

faradaysElectromagneticLab.register( 'Compass', Compass );