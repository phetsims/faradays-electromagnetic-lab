// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoilSamplePointsNode is a debugging Node for displaying the sample points that are distributed along the
 * vertical axis of the pickup coil. These are the points at which the B-field is sampled by the coil.
 * This Node can be made visible via the developer controls that are available when running with &dev query parameter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickupCoil from '../model/PickupCoil.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';

export default class PickupCoilSamplePointsNode extends Node {

  public constructor( pickupCoil: PickupCoil ) {

    const path = new Path( null, {
      fill: 'yellow'
    } );

    const update = () => {
      const shape = new Shape();
      for ( let i = 0; i < pickupCoil.samplePoints.length; i++ ) {
        const samplePoint = pickupCoil.samplePoints[ i ];
        shape.moveToPoint( samplePoint );
        shape.circle( samplePoint, 2 );
        path.shape = shape;
      }
    };

    pickupCoil.samplePoints.addItemAddedListener( () => update() );
    pickupCoil.samplePoints.addItemRemovedListener( () => update() );

    super( {
      children: [ path ],
      visibleProperty: pickupCoil.samplePointsVisibleProperty
    } );

    update();
  }
}

faradaysElectromagneticLab.register( 'PickupCoilSamplePointsNode', PickupCoilSamplePointsNode );