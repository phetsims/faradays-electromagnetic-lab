// Copyright 2024, University of Colorado Boulder

/**
 * CoilSegmentNode renders one segment of a coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Path } from '../../../../scenery/js/imports.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import CoilSegment from '../model/CoilSegment.js';

export default class CoilSegmentNode extends Path {

  public constructor( coilSegment: CoilSegment, wireWidth: number ) {
    super( coilSegment.toShape(), {
      stroke: coilSegment.stroke,
      lineWidth: wireWidth,
      lineCap: 'round',
      lineJoin: 'bevel',
      strokePickable: true
    } );
  }
}

faradaysElectromagneticLab.register( 'CoilSegmentNode', CoilSegmentNode );