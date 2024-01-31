// Copyright 2023-2024, University of Colorado Boulder

/**
 * CoilSegment is one segment of a coil, described by a quadratic bezier spline. An array of CoilSegment is used to
 * draw the coil, and to guide the flow of electrons in the coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Node, Path, PathOptions } from '../../../../scenery/js/imports.js';
import QuadraticBezierSpline from './QuadraticBezierSpline.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  speedScale?: number; // see field speedScale
};

export type CoilSegmentOptions = SelfOptions & PathOptions;

export default class CoilSegment extends Path {

  // The curve
  public readonly curve: QuadraticBezierSpline;

  // The parent Node for this segment and any electrons that appear in this segment.
  // This will be either CoilNode foregroundNode or backgroundNode.
  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/49 parentNode may become unnecessary if we change how electrons are rendered.
  public readonly parentNode: Node;

  // This value is used to adjust the speed of electrons along this segment. It's useful in cases where a set of
  // CoilSegments contains segments of different lengths, and the speed needs to be scaled in order to make electrons
  // appear to move at the same speed along all segments.
  public readonly speedScale;

  public constructor( curve: QuadraticBezierSpline, parentNode: Node, providedOptions: CoilSegmentOptions ) {

    const options = optionize<CoilSegmentOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      speedScale: 1
    }, providedOptions );

    assert && assert( options.speedScale > 0, `invalid speedScale: ${options.speedScale}` );

    super( curve.toShape(), options );

    this.curve = curve;
    this.parentNode = parentNode;
    this.speedScale = options.speedScale;
  }
}

faradaysElectromagneticLab.register( 'CoilSegment', CoilSegment );