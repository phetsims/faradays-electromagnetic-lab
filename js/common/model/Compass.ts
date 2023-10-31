// Copyright 2023, University of Colorado Boulder

/**
 * Compass is the abstract base class for compass models.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Magnet from './Magnet.js';

export default abstract class Compass extends PhetioObject {

  public readonly positionProperty: Property<Vector2>; // unitless
  public readonly rotationProperty: Property<number>; // radians
  public readonly enabledProperty: Property<boolean>; //TODO why do we have this?

  private readonly magnet: Magnet;
  private readonly scratchVector: Vector2;

  protected constructor( magnet: Magnet, tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioState: false
    } );

    this.magnet = magnet;
    this.scratchVector = new Vector2( 0, 0 );

    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );

    this.rotationProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'rotationProperty' )
    } );

    this.enabledProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'enabledProperty' )
    } );
  }

  public reset(): void {
    this.positionProperty.reset();
    this.rotationProperty.reset();
    this.enabledProperty.reset();
  }

  public step( dt: number ): void {
    if ( this.enabledProperty.value ) {
      this.magnet.getBField( this.positionProperty.value, this.scratchVector /* output */ );
      if ( this.scratchVector.magnitude !== 0 ) {
        this.setDirection( this.scratchVector, dt );
      }
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