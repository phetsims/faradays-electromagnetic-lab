// Copyright 2023-2024, University of Colorado Boulder

/**
 * SamplePointsStrategy is the abstract base class for a strategy that creates B-field sample points for a pickup coil.
 * Sample points are distributed along a vertical line that goes through the center of a pickup coil. The B-field is
 * sampled at these points, and used to compute the induced EMF in the pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default abstract class PickupCoilSamplePointsStrategy {

  /**
   * Give the loop radius of the pickup coil, create the sample points along a vertical line that goes through
   * the center of the pickup coil. One point is guaranteed to be at the center of the coil.
   */
  public abstract createSamplePoints( loopRadius: number ): Vector2[];
}

/**
 * FixedNumberOfSamplePointsStrategy has a fixed number of points and variable spacing. The points are distributed
 * along a vertical line that goes through the center of a pickup coil. The number of sample points must be odd, so
 * that one point is at the center of the coil. The points at the outer edge are guaranteed to be on the coil.
 */
export class FixedNumberOfSamplePointsStrategy extends PickupCoilSamplePointsStrategy {

  private readonly numberOfSamplePoints: number;

  public constructor( numberOfSamplePoints: number ) {
    assert && assert( Number.isInteger( numberOfSamplePoints ) && numberOfSamplePoints > 0 && numberOfSamplePoints % 2 === 1,
      `invalid numberOfSamplePoints=${numberOfSamplePoints}, must be an odd integer` );
    super();
    this.numberOfSamplePoints = numberOfSamplePoints;
  }

  public override createSamplePoints( loopRadius: number ): Vector2[] {
    const numberOfSamplePointsOnRadius = ( this.numberOfSamplePoints - 1 ) / 2;
    const ySpacing = loopRadius / numberOfSamplePointsOnRadius;
    const samplePoints = createSamplePoints( numberOfSamplePointsOnRadius, ySpacing );
    phet.log && phet.log( `FixedNumberOfSamplePointsStrategy.createSamplePoints: numberOfSamplePoints=${samplePoints.length} ySpacing=${ySpacing}` );
    return samplePoints;
  }
}

/**
 * FixedSpacingSamplePointsStrategy has a fixed y-spacing and variable number of points. Points are distributed along
 * a vertical line that goes through the center of a pickup coil. One point is at the center of the coil. Points will
 * be on the edge of the coil only if the coil's radius is an integer multiple of the spacing.
 */
export class FixedSpacingSamplePointsStrategy extends PickupCoilSamplePointsStrategy {

  private readonly ySpacing: number;

  public constructor( ySpacing: number ) {
    assert && assert( ySpacing > 0, `invalid ySpacing=${ySpacing}` );
    super();
    this.ySpacing = ySpacing;
  }

  public override createSamplePoints( loopRadius: number ): Vector2[] {
    const numberOfSamplePointsOnRadius = Math.trunc( loopRadius / this.ySpacing );
    const samplePoints = createSamplePoints( numberOfSamplePointsOnRadius, this.ySpacing );
    phet.log && phet.log( `FixedSpacingSamplePointsStrategy.createSamplePoints: numberOfSamplePoints=${samplePoints.length} ySpacing=${this.ySpacing}` );
    return samplePoints;
  }
}

/**
 * Common implementation used by both strategies.
 */
function createSamplePoints( numberOfSamplePointsOnRadius: number, ySpacing: number ): Vector2[] {

  const samplePoints: Vector2[] = [];

  // All sample points share the same x offset.
  const xOffset = 0;

  // A point at the center of the coil
  let index = 0;
  samplePoints[ index++ ] = new Vector2( xOffset, 0 );

  // Points below and above the center
  let y = 0;
  for ( let i = 0; i < numberOfSamplePointsOnRadius; i++ ) {
    y += ySpacing;
    samplePoints[ index++ ] = new Vector2( xOffset, y );
    samplePoints[ index++ ] = new Vector2( xOffset, -y );
  }

  return samplePoints;
}

faradaysElectromagneticLab.register( 'PickupCoilSamplePointsStrategy', PickupCoilSamplePointsStrategy );