// Copyright 2024, University of Colorado Boulder

/**
 * FieldPositionsNode is a debugging tool, used to confirm that the needles are properly positioned in the B-field
 * visualization. Running with ?showFieldPositions adds this Node to the scene graph, and renders a yellow dot
 * (small circle) where the center of each needle should be. If the dots are not centered on the needles, then
 * positioning in FieldNode is incorrect.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Shape from '../../../../kite/js/Shape.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FieldNode from './FieldNode.js';

export default class FieldPositionsNode extends Path {

  public constructor( visibleBoundsProperty: TReadOnlyProperty<Bounds2> ) {

    super( null, {
      isDisposable: false,
      fill: 'yellow'
    } );

    visibleBoundsProperty.link( visibleBounds => this.rebuild( visibleBounds ) );
  }

  /**
   * Fills the visible bounds of the browser, placing a dot where the center of each needle should appear.
   */
  private rebuild( visibleBounds: Bounds2 ): void {
    const shape = new Shape();
    const margin = FieldNode.NEEDLE_SPACING / 4;
    for ( let x = visibleBounds.left + margin; x <= visibleBounds.right; x = x + FieldNode.NEEDLE_SPACING ) {
      for ( let y = visibleBounds.top + margin; y <= visibleBounds.bottom; y = y + FieldNode.NEEDLE_SPACING ) {
        shape.circle( x, y, 1 );
      }
    }
    this.shape = shape;
  }
}

faradaysElectromagneticLab.register( 'FieldPositionsNode', FieldPositionsNode );