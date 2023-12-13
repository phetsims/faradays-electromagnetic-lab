// Copyright 2023, University of Colorado Boulder

/**
 * QuadraticBezierSpline is a quadratic bezier spline, described by a start point, an end point, and a control point.
 * de Caselijau's algorithm is used to find points along the curve.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Vector2 from '../../../../dot/js/Vector2.js';


export default class QuadraticBezierSpline {

  public readonly startPoint: Vector2;
  public readonly controlPoint: Vector2;
  public readonly endPoint: Vector2;

  public constructor( startPoint: Vector2, controlPoint: Vector2, endPoint: Vector2 ) {
    this.startPoint = startPoint;
    this.controlPoint = controlPoint;
    this.endPoint = endPoint;
  }

  /**
   * Uses the de Castelijau algorithm to determine the point that is some fraction t of the way along the curve from
   * the start point to the end point.
   *
   * TODO Flip the semantics to be a percent along the path, 0=start, 1=end.
   * @param t a value between 0 and 1. t=1 is at the start point, and t=0 is at the end point.
   */
  public evaluate( t: number ): Vector2 {
    assert && assert( t >= 0 && t <= 1, `invalid t: ${t}` );

    const x1 = this.startPoint.x;
    const y1 = this.startPoint.y;
    const x2 = this.endPoint.x;
    const y2 = this.endPoint.y;
    const cx = this.controlPoint.x;
    const cy = this.controlPoint.y;

    const x = ( x1 * t * t ) + ( cx * 2 * t * ( 1 - t ) ) + ( x2 * ( 1 - t ) * ( 1 - t ) );
    const y = ( y1 * t * t ) + ( cy * 2 * t * ( 1 - t ) ) + ( y2 * ( 1 - t ) * ( 1 - t ) );

    return new Vector2( x, y );
  }
}

faradaysElectromagneticLab.register( 'QuadraticBezierSpline', QuadraticBezierSpline );