// Copyright 2023, University of Colorado Boulder

/**
 * FieldInsideNode is the visualization of the field inside the bar magnet. It is a grid of compass needles inside
 * the bounds of the bar magnet. Alpha is modulated as the strength of the magnet changes.  It is assumed that this
 * will be added to BarMagnetNode, and will therefore move with the bar magnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { GridBox, GridBoxOptions } from '../../../../scenery/js/imports.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CompassNeedleNode from './CompassNeedleNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import FELColors from '../FELColors.js';

//TODO compute these values based on magnet size, needle size, and desired xMargin and yMargin
const FIELD_INSIDE_ROWS = 2;
const FIELD_INSIDE_COLUMNS = 7;
const FIELD_INSIDE_X_SPACING = 6;
const FIELD_INSIDE_Y_SPACING = 12;

type SelfOptions = EmptySelfOptions;

type FieldInsideNodeOptions = SelfOptions & PickRequired<GridBoxOptions, 'tandem' | 'visibleProperty' | 'center'>;

export default class FieldInsideNode extends GridBox {

  public constructor( strengthProperty: NumberProperty, providedOptions: FieldInsideNodeOptions ) {

    const options = optionize<FieldInsideNodeOptions, SelfOptions, GridBoxOptions>()( {

      // GridBoxOptions
      isDisposable: false,
      children: _.times( FIELD_INSIDE_ROWS * FIELD_INSIDE_COLUMNS, () => new CompassNeedleNode( {
        stroke: FELColors.fieldInsideStrokeProperty
      } ) ),
      autoRows: FIELD_INSIDE_ROWS,
      xSpacing: FIELD_INSIDE_X_SPACING,
      ySpacing: FIELD_INSIDE_Y_SPACING
    }, providedOptions );

    super( options );

    // Visualize field strength by modulating opacity as magnet strength changes.
    //TODO Is linear modulation OK?
    strengthProperty.link( strength => {
      this.opacity = strength / strengthProperty.rangeProperty.value.max;
    } );
  }
}

faradaysElectromagneticLab.register( 'FieldInsideNode', FieldInsideNode );