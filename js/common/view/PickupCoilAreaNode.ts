// Copyright 2024, University of Colorado Boulder

/**
 * PickupCoilAreaNode is a debugging Node for displaying a visualization of how the area of the pickup coil is modeled.
 * The coil is divided into a set of rectangles. There is one rectangle for each sample point, and the rectangle is
 * the sample point's contribution to the area of one loop. The sum of the rectangles approximates the area of the loop.
 * This visualization is as if you are looking down the x-axis, into the coil.
 * See https://github.com/phetsims/faradays-electromagnetic-lab/issues/156
 *
 * This Node can be made visible via the developer controls that are available when running with &dev query parameter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Shape from '../../../../kite/js/Shape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickupCoil from '../model/PickupCoil.js';

export default class PickupCoilAreaNode extends Node {

  public constructor( pickupCoil: PickupCoil ) {

    const path = new Path( null, {
      stroke: 'yellow',
      opacity: 0.4,
      lineWidth: 1
    } );

    super( {
      isDisposable: false,
      children: [ path ],
      visibleProperty: pickupCoil.samplePointsVisibleProperty,
      pickable: false
    } );

    // Reusable instance, to optimize memory allocation.
    const reusableDimension = new Dimension2( 0, 0 );

    // Draw a rectangle for the portion of the area associated with each sample point.
    Multilink.multilink(
      [ this.visibleProperty, pickupCoil.samplePointsProperty, pickupCoil.positionProperty, pickupCoil.magnet.positionProperty ],
      ( ( visible, samplePoints, pickupCoilPosition, magnetPosition ) => {
        if ( visible ) {
          const shape = new Shape();
          samplePoints.forEach( samplePoint => {
            const size = pickupCoil.getSamplePointAreaDimensions( samplePoint, reusableDimension );
            if ( size.width > 0 && size.height > 0 ) {
              shape.rect( -size.width / 2, samplePoint.y - size.height / 2, size.width, size.height );
            }
          } );
          path.shape = shape;
        }
      } ) );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilAreaNode', PickupCoilAreaNode );