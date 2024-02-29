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

  public constructor( curve: QuadraticBezierSpline, layer: CoilLayer, providedOptions: CoilSegmentOptions ) {

    const options = optionize<CoilSegmentOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      speedScale: 1
    }, providedOptions );

    assert && assert( options.speedScale > 0, `invalid speedScale: ${options.speedScale}` );

    this.curve = curve;
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
}

faradaysElectromagneticLab.register( 'CoilSegment', CoilSegment );