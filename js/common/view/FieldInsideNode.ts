// Copyright 2023-2024, University of Colorado Boulder

//TODO Use a more specific class name, since this is the field inside a bar magnet.

/**
 * FieldInsideNode is the visualization of the field inside the bar magnet. It is a grid of compass needles inside
 * the bounds of the bar magnet. Alpha is modulated as the strength of the magnet changes.  It is assumed that this
 * will be added to BarMagnetNode, and will therefore move with the bar magnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { GridBox, GridBoxOptions } from '../../../../scenery/js/imports.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import CompassNeedleNode from './CompassNeedleNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BarMagnet from '../model/BarMagnet.js';

const ROWS = 2;
const COLUMNS = 7; // determined empirically

type SelfOptions = EmptySelfOptions;

type FieldInsideNodeOptions = SelfOptions & PickRequired<GridBoxOptions, 'tandem' | 'visibleProperty' | 'center'>;

export default class FieldInsideNode extends GridBox {

  public constructor( barMagnet: BarMagnet, providedOptions: FieldInsideNodeOptions ) {

    const options = optionize<FieldInsideNodeOptions, SelfOptions, GridBoxOptions>()( {

      // GridBoxOptions
      isDisposable: false,
      children: _.times( ROWS * COLUMNS, () => new CompassNeedleNode() ),
      autoRows: ROWS,
      xSpacing: 6, // determined empirically
      ySpacing: 12 // determined empirically
    }, providedOptions );

    super( options );

    // Visualize field strength by modulating opacity as magnet strength changes.
    barMagnet.strengthProperty.link( strength => {
      this.opacity = strength / barMagnet.strengthRange.max;
    } );
  }
}

faradaysElectromagneticLab.register( 'FieldInsideNode', FieldInsideNode );