// Copyright 2023-2024, University of Colorado Boulder

/**
 * QuadraticBezierSpline is a quadratic Bezier spline, described by a start point, an end point, and a control point.
 * de Caselijau's algorithm is used to find points along the curve.
 *
 * This is based on QuadraticBezierSpline.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';


export default class QuadraticBezierSpline {

  private readonly startPoint: Vector2;
  private readonly controlPoint: Vector2;
  private readonly endPoint: Vector2;

  public constructor( startPoint: Vector2, controlPoint: Vector2, endPoint: Vector2 ) {
    this.startPoint = startPoint;
    this.controlPoint = controlPoint;
    this.endPoint = endPoint;
  }

  /**
   * Uses the de Casteljau algorithm to determine the point that is some fraction t of the way along the curve from
   * the start point to the end point.
   *
   * @param t - a value between 0 and 1. t=1 is at the start point, and t=0 is at the end point.
   * @param [returnVector] - result is written to this vector, or a Vector2 is allocated if not provided
   */
  public evaluate( t: number, returnVector?: Vector2 ): Vector2 {
    assert && assert( t >= 0 && t <= 1, `invalid t: ${t}` );

    returnVector = returnVector || new Vector2( 0, 0 );

    const x1 = this.startPoint.x;
    const y1 = this.startPoint.y;
    const x2 = this.endPoint.x;
    const y2 = this.endPoint.y;
    const cx = this.controlPoint.x;
    const cy = this.controlPoint.y;

    const x = ( x1 * t * t ) + ( cx * 2 * t * ( 1 - t ) ) + ( x2 * ( 1 - t ) * ( 1 - t ) );
    const y = ( y1 * t * t ) + ( cy * 2 * t * ( 1 - t ) ) + ( y2 * ( 1 - t ) * ( 1 - t ) );

    return returnVector.setXY( x, y );
  }

  /**
   * Gets the Shape used to render this curve. Allocates a Shape instance.
   */
  public toShape(): Shape {
    return new Shape()
      .moveToPoint( this.startPoint )
      .quadraticCurveToPoint( this.controlPoint, this.endPoint );
  }
}

faradaysElectromagneticLab.register( 'QuadraticBezierSpline', QuadraticBezierSpline );