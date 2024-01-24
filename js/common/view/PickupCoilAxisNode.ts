// Copyright 2024, University of Colorado Boulder

/**
 * PickupCoilAxisNode is the horizontal axis that runs through the center of the pickup coil.
 * When visible, this line spans the width of the browser window.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { HBox, Line, Node, Path } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import FELColors from '../FELColors.js';
import { Shape } from '../../../../kite/js/imports.js';

export default class PickupCoilAxisNode extends Line {

  public constructor( isLockedToAxisProperty: TReadOnlyProperty<boolean>,
                      pickupCoilPositionProperty: TReadOnlyProperty<Vector2>,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2> ) {

    // Correct length will be set by Multilink below.
    super( 0, 0, 1, 0, {
      isDisposable: false,
      visibleProperty: isLockedToAxisProperty,
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

  /**
   * Creates an icon, used for the checkbox that locks dragging to this axis.
   */
  public static createIcon(): Node {

    const dashLength = 5;
    const headWidth = 5;
    const headHeight = 5;
    const numberOfDashes = 4;

    const line = new Line( 0, 0, ( 2 * numberOfDashes - 1 ) * dashLength, 0, {
      stroke: FELColors.pickupCoilAxisStrokeProperty,
      lineWidth: 2,
      lineDash: [ dashLength, dashLength ]
    } );

    const leftHead = new Path( new Shape().moveTo( 0, 0 ).lineTo( headWidth, -headHeight ).lineTo( headWidth, headHeight ).close(), {
      fill: FELColors.pickupCoilAxisStrokeProperty
    } );

    const rightHead = new Path( new Shape().moveTo( 0, 0 ).lineTo( -headWidth, -headHeight ).lineTo( -headWidth, headHeight ).close(), {
      fill: FELColors.pickupCoilAxisStrokeProperty
    } );

    return new HBox( {
      spacing: 0,
      children: [ leftHead, line, rightHead ]
    } );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilAxisNode', PickupCoilAxisNode );