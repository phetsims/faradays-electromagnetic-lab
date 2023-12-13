// Copyright 2023, University of Colorado Boulder

/**
 * ElectronPathDescriptor contains a description of one segment of an Electron's path. This description is used
 * exclusively by the view to describe the visual representation of segments of a coil, for the purposes of animating
 * the flow of electrons in the coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Node } from '../../../../scenery/js/imports.js';
import QuadraticBezierSpline from './QuadraticBezierSpline.js';

type Layer = 'foreground' | 'background';

export default class ElectronPathDescriptor {

  // The default speed scale
  public static readonly DEFAULT_SPEED_SCALE = 1.0;

  // The curve
  public readonly curve: QuadraticBezierSpline;

  // The parent graphic
  public readonly parent: Node;

  // The layer that the curve is in
  private readonly layer: Layer;

  // How to scale the speed for this curve (any positive value). This value is used to adjust the speed of electrons
  // along the curve. It's useful in cases where a set of ElectronPathDescriptors contains curves of different lengths,
  // and the speed needs to be scaled in order to make electron "speed" appear the same on all curves.
  public readonly speedScale;

  public constructor( curve: QuadraticBezierSpline, parent: Node, layer: Layer, speedScale = ElectronPathDescriptor.DEFAULT_SPEED_SCALE ) {
    assert && assert( speedScale > 0, `invalid speedScale: ${speedScale}` );
    this.curve = curve;
    this.parent = parent;
    this.layer = layer;
    this.speedScale = speedScale;
  }
}

faradaysElectromagneticLab.register( 'ElectronPathDescriptor', ElectronPathDescriptor );