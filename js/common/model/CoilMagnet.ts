// Copyright 2024, University of Colorado Boulder

/**
 * CoilMagnet is the base class for magnets that are based on a coil.  The shape of the model is a square, and the
 * calculation of the magnetic field at some point of interest varies depending on whether the point is inside or
 * outside the square.
 *
 * Note that Electromagnet is currently the only concrete subclass of CoilMagnet, so CoilMagnet could be absorbed
 * into Electromagnet. But as in the Java version, we've chosen to keep them separate.
 *
 * This is based on CoilMagnet.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension3 from '../../../../dot/js/Dimension3.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Coil from './Coil.js';
import Magnet, { MagnetOptions } from './Magnet.js';

type SelfOptions = EmptySelfOptions;

export type CoilMagnetOptions = SelfOptions & StrictOmit<MagnetOptions, 'size'>;

export default class CoilMagnet extends Magnet {

  // Loop radius, unitless
  private readonly loopRadius: number;

  protected constructor( coil: Coil, strengthProperty: TReadOnlyProperty<number>, strengthRange: Range, providedOptions: CoilMagnetOptions ) {

    assert && assert( coil.loopAreaPercentProperty.range.getLength() === 0,
      'This model does not support dynamic loop area for the coil magnet.' );
    const loopRadius = coil.loopRadiusProperty.value;

    const options = optionize<CoilMagnetOptions, SelfOptions, MagnetOptions>()( {

      // MagnetOptions
      size: new Dimension3( 2 * loopRadius, 2 * loopRadius, 2 * loopRadius )
    }, providedOptions );

    super( strengthProperty, strengthRange, options );

    this.loopRadius = loopRadius;
  }

  /**
   * Gets the B-field vector at a point in the magnet's local 2D coordinate frame.
   *
   * @param position - in the magnet's local coordinate frame
   * @param returnVector - result is written to this vector
   */
  protected override getLocalFieldVector( position: Vector2, returnVector: Vector2 ): Vector2 {
    return ( this.localBounds.containsPoint( position ) ) ?
           this.getLocalFieldVectorInside( returnVector ) :
           this.getLocalFieldVectorOutside( position, returnVector );
  }

  /**
   * Gets the B-field vector for points inside the coil.
   * See faradays-electromagnetic-lab/doc/java-version/faraday-notes-2005.pdf
   *
   * Terminology:
   * R = radius of the coil
   * r = distance from the origin to (x,y)
   *
   * Outside the coil, where r <= R:
   * Bx = ( 2 * m ) / R^e = magnet strength
   * By = 0
   *
   * @param returnVector - result is written to this vector
   */
  private getLocalFieldVectorInside( returnVector: Vector2 ): Vector2 {
    return returnVector.setXY( this.strengthProperty.value, 0 );
  }

  /**
   * Gets the B-field vector for points outside the coil (r > R).
   * Algorithm courtesy of Mike Dubson (dubson@spot.colorado.edu).
   * See faradays-electromagnetic-lab/doc/java-version/faraday-notes-2005.pdf
   *
   * Terminology:
   * axes oriented with +x right, +y up
   * origin is the center of the coil, at (0,0)
   * (x,y) is the point of interest where we are measuring the magnetic field
   * S = magnet strength, in G
   * m = magnetic moment
   * R = radius of the electromagnet coil
   * r = distance from the electromagnet origin to (x,y)
   * theta = angle between the x-axis and (x,y)
   * Bx = x component of the B field
   * By = y component of the B field
   * e is the exponent that specifies how the field decreases with distance (e=3 in reality)
   *
   * Outside the coil, where r > R:
   * Bx = ( m / r^e ) * ( ( 3 * cos(theta) * cos(theta) ) - 1 )
   * By = ( m / r^e ) * ( 3 * cos(theta) * sin(theta) )
   *
   * where:
   * r = sqrt( x^2 + y^2 )
   * cos(theta) = x / r
   * sin(theta) = y / r
   *
   * @param position - in the magnet's local coordinate frame
   * @param returnVector - result is written to this vector
   */
  private getLocalFieldVectorOutside( position: Vector2, returnVector: Vector2 ): Vector2 {

    // Elemental terms
    const x = position.x;
    const y = position.y;
    const r = Math.sqrt( ( x * x ) + ( y * y ) );
    const R = this.loopRadius;

    // Inside the magnet: Bx = S = (2 * m) / (R^3). Rewriting this gives us: m = S * (R^3) / 2.
    const m = this.strengthProperty.value * Math.pow( R, 3 ) / 2;

    // Recurring terms
    const C = m / Math.pow( r, 3 );
    const cosTheta = x / r;
    const sinTheta = y / r;

    // A constant fudge factor, to prevent the pickup coil flux from being negative due to large Bx just outside
    // the electromagnet coil. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/166
    const F = 0.8;

    // B-field component vectors
    const Bx = F * C * ( ( 3 * cosTheta * cosTheta ) - 1 );
    const By = F * C * ( 3 * cosTheta * sinTheta );

    // B-field vector
    returnVector.setXY( Bx, By );

    return returnVector;
  }
}

faradaysElectromagneticLab.register( 'CoilMagnet', CoilMagnet );