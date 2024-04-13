// Copyright 2024, University of Colorado Boulder

/**
 * PickupCoilAreaNode is a debugging Node for displaying a visualization of how the area of the pickup coil is modeled.
 * The coil is divided into a set of rectangles. There is one rectangle for each sample point, and the rectangle is
 * the sample point's contribution to the area of one loop. The sum of the area for the rectangles approximates the
 * area of the loop. This visualization is as if you were looking down the x-axis, into the coil.
 * See https://github.com/phetsims/faradays-electromagnetic-lab/issues/156
 *
 * This Node can be made visible via the developer controls that are available when running with &dev query parameter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node, Path } from '../../../../scenery/js/imports.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickupCoil from '../model/PickupCoil.js';
import { Shape } from '../../../../kite/js/imports.js';

export default class PickupCoilAreaNode extends Node {

  public constructor( pickupCoil: PickupCoil ) {

    const path = new Path( null, {
      stroke: 'yellow',
      lineWidth: 1
    } );

    pickupCoil.samplePointsProperty.link( () => {
      const shape = new Shape();
      pickupCoil.samplePointsProperty.value.forEach( samplePoint => {

        // Use the algorithm for distance from center of circle to a chord to compute the length of the chord that
        // is perpendicular to the vertical line that goes through the sample points. If you're unfamiliar with this,
        // then see for example https://youtu.be/81jh931BkL0?si=2JR-xWRUwjeuagmf.
        const d = samplePoint.y; // distance from center of the circle to the chord
        const R = pickupCoil.coil.loopRadiusProperty.value;
        const chordLength = 2 * Math.sqrt( Math.abs( R * R - d * d ) );

        shape.moveTo( -chordLength / 2, samplePoint.y );
        shape.lineTo( chordLength / 2, samplePoint.y );
      } );
      path.shape = shape;
    } );

    super( {
      children: [ path ],
      visibleProperty: pickupCoil.samplePointsVisibleProperty
    } );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilAreaNode', PickupCoilAreaNode );