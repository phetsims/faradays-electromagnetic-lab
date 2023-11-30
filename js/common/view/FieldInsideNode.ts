// Copyright 2023, University of Colorado Boulder

/**
 * FieldInsideNode is the visualization of the field inside the bar magnet. It is a grid of compass needles inside
 * the bounds of the bar magnet. Alpha is modulated as the strength of the magnet changes.  It is assumed that this
 * will be added to BarMagnetNode, and will therefore move with the bar magnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { GridBox } from '../../../../scenery/js/imports.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CompassNeedleNode from './CompassNeedleNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';

//TODO Perhaps we should change the implementation to compute these values based on magnet size.
const FIELD_INSIDE_ROWS = 2;
const FIELD_INSIDE_COLUMNS = 7;
const FIELD_INSIDE_X_SPACING = 10;
const FIELD_INSIDE_Y_SPACING = 12;

export default class FieldInsideNode extends GridBox {

  public constructor( strengthProperty: NumberProperty, visibleProperty: TReadOnlyProperty<boolean>, center: Vector2 ) {

    super( {
      children: _.times( FIELD_INSIDE_ROWS * FIELD_INSIDE_COLUMNS, () => new CompassNeedleNode() ),
      autoRows: FIELD_INSIDE_ROWS,
      xSpacing: FIELD_INSIDE_X_SPACING,
      ySpacing: FIELD_INSIDE_Y_SPACING,
      visibleProperty: visibleProperty,
      center: center
    } );

    // Modulate opacity to as magnet strength changes.
    strengthProperty.link( strength => {
      this.opacity = strength / strengthProperty.rangeProperty.value.max;
    } );
  }
}

faradaysElectromagneticLab.register( 'FieldInsideNode', FieldInsideNode );