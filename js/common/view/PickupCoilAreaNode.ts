// Copyright 2024, University of Colorado Boulder

/**
 * PickupCoilAreaNode is a debugging Node for displaying a visualization of how the area of the pickup coil is modeled.
 * The coil is divided into a set of rectangles. There is one rectangle for each sample point, and the rectangle is
 * the sample point's contribution to the area of one loop. The sum of the area for the rectangles approximates the
 * area of the loop. This visualization is as if you are looking down the x-axis, into the coil.
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
import Multilink from '../../../../axon/js/Multilink.js';

export default class PickupCoilAreaNode extends Node {

  public constructor( pickupCoil: PickupCoil ) {

    const path = new Path( null, {
      stroke: 'yellow',
      lineWidth: 1
    } );

    super( {
      isDisposable: false,
      children: [ path ],
      visibleProperty: pickupCoil.samplePointsVisibleProperty
    } );

    Multilink.multilink(
      [ this.visibleProperty, pickupCoil.samplePointsProperty, pickupCoil.positionProperty, pickupCoil.magnet.positionProperty ],
      ( ( visible, samplePoints, pickupCoilPosition, magnetPosition ) => {

        // This is relatively expensive, so update only when visible.
        if ( visible ) {
          const shape = new Shape();
          samplePoints.forEach( samplePoint => {

            let chordLength;
            if ( pickupCoil.magnet.isInside( pickupCoilPosition.plus( samplePoint ) ) ) {

              // When a sample point is inside the magnet, use the magnet's thickness so that we do not exaggerate the
              // EMF contribution by using the entire cross-section of the coil. The field outside the magnet is relatively
              // weak, so ignore its contribution.
              chordLength = pickupCoil.magnet.thickness;
            }
            else {

              // Use the algorithm for distance from center of circle to a chord to compute the length of the chord that
              // is perpendicular to the vertical line that goes through the sample points. If you're unfamiliar with this,
              // then see for example https://youtu.be/81jh931BkL0?si=2JR-xWRUwjeuagmf.
              const d = samplePoint.y; // distance from center of the circle to the chord
              const R = pickupCoil.coil.loopRadiusProperty.value;
              chordLength = 2 * Math.sqrt( Math.abs( R * R - d * d ) );
            }

            shape.moveTo( -chordLength / 2, samplePoint.y );
            shape.lineTo( chordLength / 2, samplePoint.y );
          } );
          path.shape = shape;
        }
      } ) );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilAreaNode', PickupCoilAreaNode );