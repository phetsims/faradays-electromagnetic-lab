// Copyright 2023, University of Colorado Boulder

//TODO This is a rudimentary implementation
//TODO dragBounds
//TODO color profile

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

type SelfOptions = {
  position?: Vector2; // initial value of positionProperty, unitless
};

export type CompassOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class Compass extends PhetioObject {

  public readonly positionProperty: Property<Vector2>; // unitless
  public readonly rotationProperty: Property<number>; // radians

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
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.rotationProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'rotationProperty' )
    } );
  }

  public reset(): void {
    this.positionProperty.reset();
    this.rotationProperty.reset();
  }

  //TODO If the clock is paused and the magnet moves, update immediately to match the field vector
  public step( dt: number ): void {
    const fieldVector = this.magnet.getFieldVector( this.positionProperty.value, this.scratchVector );
    if ( fieldVector.magnitude !== 0 ) {
      this.setDirection( fieldVector, dt );
    }
  }

  /**
   * Sets the compass needle's direction.
   * @param fieldVector - the B-field vector at the compass location
   * @param dt - time step, in seconds
   */
  public abstract setDirection( fieldVector: Vector2, dt: number ): void;

  /**
   * Starts the compass needle moving immediately.
   */
  public abstract startMovingNow(): void;
}

faradaysElectromagneticLab.register( 'Compass', Compass );