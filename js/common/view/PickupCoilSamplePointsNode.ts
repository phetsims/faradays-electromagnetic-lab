// Copyright 2023-2025, University of Colorado Boulder

/**
 * PickupCoilSamplePointsNode is a debugging Node for displaying the sample points that are distributed along the
 * vertical axis of the pickup coil. These are the points at which the B-field is sampled by the coil.
 * This Node can be made visible via the developer controls that are available when running with &dev query parameter.
 *
 * This is based on PickupCoilSamplePointsGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickupCoil from '../model/PickupCoil.js';

export default class PickupCoilSamplePointsNode extends Node {

  public constructor( pickupCoil: PickupCoil ) {

    const path = new Path( null, {
      fill: 'yellow'
    } );

    pickupCoil.samplePointsProperty.link( () => {
      const shape = new Shape();
      pickupCoil.samplePointsProperty.value.forEach( samplePoint => {
        shape.moveToPoint( samplePoint );
        shape.circle( samplePoint, 2 );
      } );
      path.shape = shape;
    } );

    super( {
      children: [ path ],
      visibleProperty: pickupCoil.samplePointsVisibleProperty,
      pickable: false
    } );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilSamplePointsNode', PickupCoilSamplePointsNode );