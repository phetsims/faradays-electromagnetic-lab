// Copyright 2023-2024, University of Colorado Boulder

/**
 * Magnet is the abstract base class for magnet models.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import FELMovable, { FELMovableOptions } from './FELMovable.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {
  rotation?: number; // initial value of rotationProperty, radians
};

export type MagnetOptions = SelfOptions & FELMovableOptions;

export default abstract class Magnet extends FELMovable {

  public readonly strengthRange: Range; // gauss
  public readonly strengthProperty: TReadOnlyProperty<number>; // gauss

  public readonly rotationProperty: Property<number>; // radians

  public readonly fieldVisibleProperty: Property<boolean>;

  // *** Writeable via developer controls only, when running with &dev query parameter. ***
  // Scales the modulation of alpha used to render the B-field visualization. In reality, the B-field drops off very
  // quickly as we move away from the magnet, and we wouldn't be able to see very much of the field. So we scale the
  // intensity of the compass needles in our visualization so that we see more of the field. Smaller values make the
  // field appear to drop off more rapidly. Larger values make the field appear to drop off more slowly.
  public readonly fieldScaleProperty: NumberProperty;

  // reusable vector for transforming a position to the magnet's local coordinate frame
  private readonly reusablePosition: Vector2;

  protected constructor( strengthProperty: TReadOnlyProperty<number>, strengthRange: Range, providedOptions: MagnetOptions ) {

    const options = optionize<MagnetOptions, SelfOptions, FELMovableOptions>()( {

      // SelfOptions
      rotation: 0
    }, providedOptions );

    super( options );

    this.strengthRange = strengthRange;
    this.strengthProperty = strengthProperty;

    this.rotationProperty = new NumberProperty( options.rotation, {
      units: 'radians',
      tandem: options.tandem.createTandem( 'rotationProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );

    this.fieldVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'fieldVisibleProperty' ),
      phetioFeatured: true
    } );

    this.fieldScaleProperty = new NumberProperty( 2.7, {
      range: new Range( 1, 6 )
      // Do not instrument. This is a PhET developer Property.
    } );

    this.reusablePosition = new Vector2( 0, 0 );
  }

  public override reset(): void {
    super.reset();
    this.rotationProperty.reset();
    this.fieldVisibleProperty.reset();
    // Do not reset developer Properties.
  }

  /**
   * Flips the magnet's polarity by rotating it 180 degrees.
   */
  public flipPolarity(): void {
    this.rotationProperty.value = ( this.rotationProperty.value + Math.PI ) % ( 2 * Math.PI );
  }

  /**
   * Is the specific point, in global coordinates, inside the magnet?
   */
  public abstract isInside( position: Vector2 ): boolean;

  /**
   * Gets the B-field vector at the specified point in the global coordinate frame.
   *
   * @param position - in the global coordinate frame
   * @param [outputVector] - result is written to this vector, or a Vector2 is allocated if not provided
   */
  public getFieldVector( position: Vector2, outputVector?: Vector2 ): Vector2 {

    outputVector = outputVector || new Vector2( 0, 0 );

    // Convert to the magnet's local coordinate frame, writes to this.reusablePosition.
    this.globalToLocalPosition( position, this.reusablePosition );

    // Get strength in the magnet's local coordinate frame, writes to outputVector.
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
   *
   * @param position - in the magnet's local coordinate frame
   * @param outputVector - result is written to this vector
   */
  protected abstract getLocalFieldVector( position: Vector2, outputVector: Vector2 ): Vector2;

  /**
   * Converts a position from the global coordinate frame to the magnet's local coordinate frame. This is essential
   * because our B-field model is in the magnet's local coordinate frame.
   */
  protected globalToLocalPosition( localPosition: Vector2, globalPosition?: Vector2 ): Vector2 {
    globalPosition = globalPosition || new Vector2( 0, 0 );
    globalPosition.set( localPosition );
    globalPosition.rotateAboutPoint( this.positionProperty.value, -this.rotationProperty.value );
    globalPosition.subtract( this.positionProperty.value );
    return globalPosition;
  }
}

faradaysElectromagneticLab.register( 'Magnet', Magnet );