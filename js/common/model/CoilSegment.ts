// Copyright 2023, University of Colorado Boulder

/**
 * CoilSegment is one segment of a coil, described by a quadratic bezier spline. An array of CoilSegment is used to
 * draw the coil, and to guide the flow of electrons in the coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Node } from '../../../../scenery/js/imports.js';
import QuadraticBezierSpline from './QuadraticBezierSpline.js';

export default class CoilSegment {

  // The default speed scale
  public static readonly DEFAULT_SPEED_SCALE = 1.0;

  // The curve
  public readonly curve: QuadraticBezierSpline;

  // The parent Node for this segment and any electrons that appear in this segment.
  public readonly parentNode: Node;

  // How to scale the speed for this curve (any positive value). This value is used to adjust the speed of electrons
  // along the curve. It's useful in cases where a set of ElectronPathDescriptors contains curves of different lengths,
  // and the speed needs to be scaled in order to make electron "speed" appear the same on all curves.
  public readonly speedScale;

  public constructor( curve: QuadraticBezierSpline, parentNode: Node, speedScale = CoilSegment.DEFAULT_SPEED_SCALE ) {
    assert && assert( speedScale > 0, `invalid speedScale: ${speedScale}` );
    this.curve = curve;
    this.parentNode = parentNode;
    this.speedScale = speedScale;
  }
}

faradaysElectromagneticLab.register( 'CoilSegment', CoilSegment );