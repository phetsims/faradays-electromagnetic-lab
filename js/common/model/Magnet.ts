// Copyright 2023-2024, University of Colorado Boulder

/**
 * Magnet is the base class for magnet models.
 *
 * This is based on AbstractMagnet.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension3 from '../../../../dot/js/Dimension3.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property, { Vector2PropertyOptions } from '../../../../dot/js/Vector2Property.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELConstants from '../FELConstants.js';
import FELQueryParameters from '../FELQueryParameters.js';

type SelfOptions = {

  // Initial value of positionProperty, unitless
  position?: Vector2;

  // Options passed to positionProperty
  positionPropertyOptions?: Vector2PropertyOptions;

  // initial value of rotationProperty, radians
  rotation?: number;

  // All of our magnets are rectangular shaped. size describes the bounds of that rectangle in local coordinates,
  // with the origin at the center.
  size: Dimension3;
};

export type MagnetOptions = SelfOptions &
  PickOptional<PhetioObjectOptions, 'phetioDocumentation'> &
  PickRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class Magnet extends PhetioObject {

  // Dimensions of a 3D magnet, with origin at its center.
  public readonly size: Dimension3;

  // Bounds of the magnet in its local coordinate frame.
  public readonly localBounds: Bounds2;

  // Position of the magnet, unitless.
  public readonly positionProperty: Property<Vector2>;

  // The range of the magnet's strength, in gauss.
  public readonly strengthRange: Range;

  // The strength of the magnet, in gauss.
  public readonly strengthProperty: TReadOnlyProperty<number>;

  // Rotation of the magnet about its position, in radians.
  public readonly rotationProperty: Property<number>;

  // Whether the visual representation of the magnetic field is visible.
  public readonly fieldVisibleProperty: Property<boolean>;

  // DEBUG: Writeable via developer controls only, when running with &dev query parameter.
  // Scales the modulation of alpha used to render the B-field visualization. In reality, the B-field drops off very
  // quickly as we move away from the magnet, and we wouldn't be able to see very much of the field. So we scale the
  // intensity of the compass needles in our visualization so that we see more of the field. Smaller values make the
  // field appear to drop off more rapidly. Larger values make the field appear to drop off more slowly. Caution: If
  // you make the value too large for the bar magnet, the field will end abruptly at the ends of the MathCAD data sets.
  public readonly fieldScaleProperty: NumberProperty;

  // Reusable vector for transforming a position to the magnet's local coordinate frame.
  private readonly reusablePosition: Vector2;

  protected constructor( strengthProperty: TReadOnlyProperty<number>, strengthRange: Range, providedOptions: MagnetOptions ) {

    const options = optionize<MagnetOptions, StrictOmit<SelfOptions, 'positionPropertyOptions'>, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      rotation: 0,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false,
      phetioFeatured: true
    }, providedOptions );

    super( options );

    this.size = options.size;

    // Rectangular, with origin at the center
    this.localBounds = new Bounds2( -this.size.width / 2, -this.size.height / 2, this.size.width / 2, this.size.height / 2 );

    this.positionProperty = new Vector2Property( options.position, combineOptions<Vector2PropertyOptions>( {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioFeatured: true
    }, options.positionPropertyOptions ) );

    this.strengthRange = strengthRange;
    this.strengthProperty = strengthProperty;

    this.rotationProperty = new NumberProperty( options.rotation, {
      units: 'radians',
      tandem: options.tandem.createTandem( 'rotationProperty' ),
      phetioReadOnly: true
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

  protected reset(): void {
    this.positionProperty.reset();
    this.rotationProperty.reset();
    this.fieldVisibleProperty.reset();
    // Do not reset Properties documented as 'DEBUG' above.
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
  public isInside( position: Vector2 ): boolean {
    return this.localBounds.containsPoint( this.globalToLocalPosition( position, this.reusablePosition ) );
  }

  /**
   * Does the magnet intersect a horizontal plane at the specific y-coordinate?
   */
  public intersectsHorizontalPlane( y: number ): boolean {
    return this.localBounds.containsPoint( this.globalToLocalXY( this.positionProperty.value.x, y, this.reusablePosition ) );
  }

  /**
   * Gets the B-field vector at the specified point in the global coordinate frame.
   *
   * @param position - in the global coordinate frame
   * @param [returnVector] - result is written to this vector, or a Vector2 is allocated if not provided
   */
  public getFieldVector( position: Vector2, returnVector?: Vector2 ): Vector2 {

    returnVector = returnVector || new Vector2( 0, 0 );

    if ( FELQueryParameters.gradientField ) {

      // Create a B-field whose Bx changes linearly from left to right, and whose By is always 0.
      // This is useful for verifying the flux behavior of the pickup coil.
      // See FELQueryParameters.gradientField and https://github.com/phetsims/faradays-electromagnetic-lab/issues/167.
      const minX = FELConstants.GRADIENT_FIELD_X_RANGE.min;
      const maxX = FELConstants.GRADIENT_FIELD_X_RANGE.max;
      const minBx = FELQueryParameters.gradientField[ 0 ];
      const maxBx = FELQueryParameters.gradientField[ 1 ];
      const Bx = Utils.clamp( Utils.linear( minX, maxX, minBx, maxBx, position.x ), minBx, maxBx );
      const By = 0;
      returnVector.setXY( Bx, By );
    }
    else {
      // Convert to the magnet's local coordinate frame, writes to this.reusablePosition.
      this.globalToLocalPosition( position, this.reusablePosition );

      // Get strength in the magnet's local coordinate frame, writes to returnVector.
      this.getLocalFieldVector( this.reusablePosition, returnVector );

      // Adjust the field vector to match the magnet's direction.
      returnVector.rotate( this.rotationProperty.value );

      // Do not allow field vector magnitude to exceed magnet strength, due to small floating-point error.
      // This was a problem in both the Java and HTML5 versions of the sim.
      if ( returnVector.magnitude > this.strengthProperty.value ) {
        returnVector.setMagnitude( this.strengthProperty.value );
      }
    }
    return returnVector;
  }

  /**
   * Gets the B-field vector at a point in the magnet's local 2D coordinate frame.
   * That is, the point is relative to the magnet's origin.
   * In the magnet's local 2D coordinate frame, it is located at (0,0),
   * and its north pole is pointing down the positive x-axis.
   *
   * @param position - in the magnet's local coordinate frame
   * @param returnVector - result is written to this vector
   */
  protected abstract getLocalFieldVector( position: Vector2, returnVector: Vector2 ): Vector2;

  /**
   * Converts a position from the global coordinate frame to the magnet's local coordinate frame. This is essential
   * because our B-field model is in the magnet's local coordinate frame.
   */
  private globalToLocalPosition( globalPosition: Vector2, returnVector?: Vector2 ): Vector2 {
    return this.globalToLocalXY( globalPosition.x, globalPosition.y, returnVector );
  }

  private globalToLocalXY( globalX: number, globalY: number, returnVector?: Vector2 ): Vector2 {
    returnVector = returnVector || new Vector2( 0, 0 );
    returnVector.setXY( globalX, globalY );
    returnVector.rotateAboutPoint( this.positionProperty.value, -this.rotationProperty.value );
    returnVector.subtract( this.positionProperty.value );
    return returnVector;
  }
}

faradaysElectromagneticLab.register( 'Magnet', Magnet );