// Copyright 2023-2025, University of Colorado Boulder

/**
 * FieldInsideBarMagnetNode is the visualization of the field inside the bar magnet. It is a grid of compass needles
 * inside the bounds of the bar magnet. Alpha is modulated as the strength of the magnet changes.  It is assumed that
 * this will be added to BarMagnetNode, and will therefore move with the bar magnet.
 *
 * This is based on BFieldInsideGraphic.java and AbstractBFieldGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import GridBox, { GridBoxOptions } from '../../../../scenery/js/layout/nodes/GridBox.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnet from '../model/BarMagnet.js';
import CompassNeedleNode from './CompassNeedleNode.js';

const ROWS = 2;
const COLUMNS = 7; // determined empirically

type SelfOptions = EmptySelfOptions;

type FieldInsideNodeOptions = SelfOptions & PickRequired<GridBoxOptions, 'tandem' | 'visibleProperty' | 'center'>;

export default class FieldInsideBarMagnetNode extends GridBox {

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

faradaysElectromagneticLab.register( 'FieldInsideBarMagnetNode', FieldInsideBarMagnetNode );