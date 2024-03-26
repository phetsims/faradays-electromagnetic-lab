// Copyright 2023-2024, University of Colorado Boulder

/**
 * CoilSegment is one segment of a coil, described by a quadratic bezier spline. An ordered array of CoilSegment
 * is used to describe and render the coil, and to guide the flow of electrons in the coil.
 *
 * This is based on ElectronPathDescriptor.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { PathOptions, TPaint } from '../../../../scenery/js/imports.js';
import QuadraticBezierSpline from './QuadraticBezierSpline.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { CoilLayer } from './Coil.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

type SelfOptions = {
  stroke: TPaint;
  speedScale?: number; // see field speedScale
};

export type CoilSegmentOptions = SelfOptions & PathOptions;

export default class CoilSegment {

  // The curve that describes this segment of the coil
  private readonly curve: QuadraticBezierSpline;

  // The layer for this segment and any electrons that appear in this segment.
  public readonly layer: CoilLayer;

  // Paint that will be used to stroke this coil segment
  public readonly stroke: TPaint;

  // This value is used to adjust the speed of electrons along this segment. It's useful in cases where a set of
  // CoilSegments contains segments of different lengths, and the speed needs to be scaled in order to make electrons
  // appear to move at the same speed along all segments.
  public readonly speedScale;

  /**
   * @param startPoint - the start point for the QuadraticBezierSpline
   * @param controlPoint - the control point for the QuadraticBezierSpline
   * @param endPoint - the end point for the QuadraticBezierSpline
   * @param layer - the layer of the coil (foreground or background) that this segment belongs to
   * @param providedOptions
   */
  public constructor( startPoint: Vector2, controlPoint: Vector2, endPoint: Vector2, layer: CoilLayer, providedOptions: CoilSegmentOptions ) {

    const options = optionize<CoilSegmentOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      speedScale: 1
    }, providedOptions );

    assert && assert( options.speedScale > 0, `invalid speedScale: ${options.speedScale}` );

    this.curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );
    this.layer = layer;
    this.stroke = options.stroke;
    this.speedScale = options.speedScale;
  }

  /**
   * Gets the Shape needed to render this CoilSegment using scenery.
   */
  public toShape(): Shape {
    return this.curve.toShape();
  }

  /**
   * Determines a point along the CoilSegment. See QuadraticBezierSpline.evaluate.
   */
  public evaluate( t: number, returnVector?: Vector2 ): Vector2 {
    return this.curve.evaluate( t, returnVector );
  }

  /**
   * Mutates the given bounds to contain the control net of this spline (which will contain the entire curve, but
   * may include some extra space).
   */
  public expandBoundsToFit( bounds: Bounds2 ): void {
    this.curve.expandBoundsToFit( bounds );
  }

  public dispose(): void {
    // Nothing to do currently. But this class is allocated dynamically, so keep this method as a bit of defensive programming.
  }
}

faradaysElectromagneticLab.register( 'CoilSegment', CoilSegment );