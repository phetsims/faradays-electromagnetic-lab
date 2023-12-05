// Copyright 2023, University of Colorado Boulder

/**
 * Magnet is the abstract base class for magnet models.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import optionize from '../../../../phet-core/js/optionize.js';
import FELMovable, { FELMovableOptions } from './FELMovable.js';

type SelfOptions = {
  rotation?: number; // initial value of rotationProperty, radians
  strengthRange: RangeWithValue; // range and initial value for strengthProperty, in gauss
};

export type MagnetOptions = SelfOptions & FELMovableOptions;

export default abstract class Magnet extends FELMovable {

  public readonly rotationProperty: Property<number>; // radians
  public readonly strengthProperty: NumberProperty; // gauss

  // reusable vector for transforming a position to the magnet's local coordinate frame
  private readonly reusablePosition: Vector2;

  protected constructor( providedOptions: MagnetOptions ) {

    const options = optionize<MagnetOptions, SelfOptions, FELMovableOptions>()( {

      // SelfOptions
      rotation: 0
    }, providedOptions );

    super( options );

    this.rotationProperty = new NumberProperty( options.rotation, {
      units: 'radians',
      tandem: options.tandem.createTandem( 'rotationProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );

    this.strengthProperty = new NumberProperty( options.strengthRange.defaultValue, {
      units: 'G',
      range: options.strengthRange,
      tandem: options.tandem.createTandem( 'strengthProperty' ),
      phetioFeatured: true
    } );

    this.reusablePosition = new Vector2( 0, 0 );
  }

  public override reset(): void {
    super.reset();
    this.rotationProperty.reset();
    this.strengthProperty.reset();
  }

  /**
   * Flips the magnet's polarity by rotating it 180 degrees.
   */
  public flipPolarity(): void {
    this.rotationProperty.value = ( this.rotationProperty.value + Math.PI ) % ( 2 * Math.PI );
  }

  /**
   * Gets the B-field vector at the specified point in the global coordinate frame.
   * If outputField is not provided, this method allocates a Vector2.
   */
  public getFieldVector( position: Vector2, outputVector = new Vector2( 0, 0 ) ): Vector2 {

    // Our models are based on a magnet located at the origin, with the North pole pointing down the positive x-axis.
    // The position argument for this method is in the global coordinate frame. So transform that position to the
    // magnet's local coordinate frame, adjusting for the magnet's position and rotation.
    this.reusablePosition.set( position );
    this.reusablePosition.rotateAboutPoint( this.positionProperty.value, -this.rotationProperty.value );
    this.reusablePosition.subtract( this.positionProperty.value );

    // Get strength in magnet's local coordinate frame, writes to outputVector.
    this.getLocalFieldVector( this.reusablePosition, outputVector );

    // Adjust the field vector to match the magnet's direction.
    outputVector.rotate( this.rotationProperty.value );

    // Clamp magnitude to magnet strength.
    //TODO Why do we need to do this? Why would outputVector.magnitude be out of range?
    const magnetStrength = this.strengthProperty.value;
    const magnitude = outputVector.magnitude;
    if ( magnitude > magnetStrength ) {
      outputVector.setMagnitude( magnetStrength );
    }
    return outputVector;
  }

  /**
   * Gets the B-field vector at a point in the magnet's local 2D coordinate frame.
   * That is, the point is relative to the magnet's origin.
   * In the magnet's local 2D coordinate frame, it is located at (0,0),
   * and its north pole is pointing down the positive x-axis.
   */
  protected abstract getLocalFieldVector( position: Vector2, outputVector: Vector2 ): Vector2;
}

faradaysElectromagneticLab.register( 'Magnet', Magnet );