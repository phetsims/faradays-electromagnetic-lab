// Copyright 2024, University of Colorado Boulder

/**
 * PickupCoilAxisNode is the horizontal axis that runs through the center of the pickup coil, and spans the width of
 * the browser window. It is visible when the 'Lock to Axis' feature is enabled.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELColors from '../FELColors.js';

export default class PickupCoilAxisNode extends Line {

  public constructor( lockToAxisProperty: TReadOnlyProperty<boolean>,
                      pickupCoilPositionProperty: TReadOnlyProperty<Vector2>,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2> ) {

    // Correct length will be set by Multilink below.
    super( 0, 0, 1, 0, {
      isDisposable: false,
      visibleProperty: lockToAxisProperty,
      stroke: FELColors.pickupCoilAxisStrokeProperty,
      lineWidth: 1,
      lineDash: [ 5, 5 ]
    } );

    // Horizontal line that passes through the pickup coil's center, and spans the visible bounds of the browser window.
    Multilink.multilink( [ this.visibleProperty, pickupCoilPositionProperty, visibleBoundsProperty ],
      ( visible, pickupCoilPosition, visibleBounds ) => {
        if ( visible ) {
          this.setLine( visibleBounds.minX, pickupCoilPosition.y, visibleBounds.maxX, pickupCoilPosition.y );
        }
      } );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilAxisNode', PickupCoilAxisNode );