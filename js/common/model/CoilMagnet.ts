// Copyright 2024, University of Colorado Boulder

//TODO Is CoilMagnet useful as a separate class, or should it be folded into Electromagnet?

/**
 * Electromagnet is the model of the electromagnet. The shape of the model is a circle, and the calculation of the
 * magnetic field at some point of interest varies depending on whether the point is inside or outside the circle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Magnet, { MagnetOptions } from './Magnet.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Shape } from '../../../../kite/js/imports.js';
import Coil from './Coil.js';

type SelfOptions = EmptySelfOptions;

export type CoilMagnetOptions = SelfOptions & MagnetOptions;

export default class CoilMagnet extends Magnet {

  private readonly loopRadius: number;
  public readonly shape: Shape;
  private readonly maxStrengthOutsideProperty: Property<number>;

  protected constructor( coil: Coil, strengthProperty: TReadOnlyProperty<number>, strengthRange: Range, providedOptions: CoilMagnetOptions ) {

    const options = providedOptions;

    super( strengthProperty, strengthRange, options );

    assert && assert( coil.loopRadiusProperty.rangeProperty.value.getLength() === 0,
      'This model does not support dynamic radius for the coil.' );
    this.loopRadius = coil.loopRadiusProperty.value;

    const R = this.loopRadius;
    this.shape = new Shape().rect( -R, -R, 2 * R, 2 * R );

    this.maxStrengthOutsideProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'maxStrengthOutsideProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
  }

  public override reset(): void {
    super.reset();
    this.maxStrengthOutsideProperty.reset();
  }

  private isInside( point: Vector2 ): boolean {
    return this.shape.containsPoint( point );
  }

  /**
   * Gets the B-field vector at a point in the magnet's local 2D coordinate frame.
   */
  protected override getLocalFieldVector( position: Vector2, outputVector: Vector2 ): Vector2 {
    return ( this.isInside( position ) ) ?
           this.getLocalFieldVectorInside( position, outputVector ) :
           this.getLocalFieldVectorOutside( position, outputVector );
  }

  /**
   * Gets the B-field vector for points inside the coil.
   *
   * Terminology:
   * R = radius of the coil
   * r = distance from the origin to (x,y)
   *
   * Outside the coil, where r <= R:
   * Bx = ( 2 * m ) / R^e = magnet strength
   * By = 0
   */
  private getLocalFieldVectorInside( position: Vector2, outputVector: Vector2 ): Vector2 {
    return outputVector.setPolar( this.strengthProperty.value, 0 );
  }

  /**
   * Gets the B-field vector for points outside the coil (r > R).
   * Algorithm courtesy of Mike Dubson (dubson@spot.colorado.edu).
   *
   * Terminology:
   * axes oriented with +X right, +Y up
   * origin is the center of the coil, at (0,0)
   * (x,y) is the point of interest where we are measuring the magnetic field
   * C = a fudge factor, set so that the lightbulb will light
   * m = magnetic moment = C * #loops * current in the coil
   * R = radius of the coil
   * r = distance from the origin to (x,y)
   * theta = angle between the X axis and (x,y)
   * Bx = X component of the B field
   * By = Y component of the B field
   * e is the exponent that specifies how the field decreases with distance (3 in reality)
   *
   * Outside the coil, where r > R:
   * Bx = ( m / r^e ) * ( ( 3 * cos(theta) * cos(theta) ) - 1 )
   * By = ( m / r^e ) * ( 3 * cos(theta) * sin(theta) )
   *
   * where:
   * r = sqrt( x^2 + y^2 )
   * cos(theta) = x / r
   * sin(theta) = y / r
   */
  private getLocalFieldVectorOutside( position: Vector2, outputVector: Vector2 ): Vector2 {

    // Elemental terms
    const x = position.x;
    const y = position.y;
    const r = Math.sqrt( ( x * x ) + ( y * y ) );
    const R = this.loopRadius;
    const distanceExponent = 3;

    // Inside the magnet, Bx = magnet strength = (2 * m) / (R^3).
    // Rewriting this gives us m = (magnet strength) * (R^3) / 2.
    const m = this.strengthProperty.value * Math.pow( R, distanceExponent ) / 2;

    // Recurring terms
    const C1 = m / Math.pow( r, distanceExponent );
    const cosTheta = x / r;
    const sinTheta = y / r;

    // B-field component vectors
    const Bx = C1 * ( ( 3 * cosTheta * cosTheta ) - 1 );
    const By = C1 * ( 3 * cosTheta * sinTheta );

    // B-field vector
    outputVector.setXY( Bx, By );

    // Use this to calibrate.
    //TODO What should we do about this? There is no calibration here or in the Java version.
    if ( outputVector.magnitude > this.maxStrengthOutsideProperty.value ) {
      this.maxStrengthOutsideProperty.value = outputVector.magnitude;
      phet.log && phet.log( `CoilMagnet: maxStrengthOutside=${this.maxStrengthOutsideProperty.value}` );
    }

    return outputVector;
  }
}

faradaysElectromagneticLab.register( 'CoilMagnet', CoilMagnet );