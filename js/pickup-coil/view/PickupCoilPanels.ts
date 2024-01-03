// Copyright 2024, University of Colorado Boulder

/**
 * PickupCoilPanels is the set of control panels for the 'Pickup Coil' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Compass from '../../common/model/Compass.js';
import PickupCoilPanel from '../../common/view/PickupCoilPanel.js';
import PickupCoil from '../../common/model/PickupCoil.js';
import BarMagnetPanel from '../../common/view/BarMagnetPanel.js';
import BarMagnet from '../../common/model/BarMagnet.js';

export default class PickupCoilPanels extends VBox {

  public constructor( barMagnet: BarMagnet, pickupCoil: PickupCoil, compass: Compass, fieldMeter: FieldMeter, tandem: Tandem ) {

    const barMagnetPanel = new BarMagnetPanel( barMagnet, compass, {
      tandem: tandem.createTandem( 'barMagnetPanel' )
    } );

    const pickupCoilPanel = new PickupCoilPanel( pickupCoil, tandem.createTandem( 'pickupCoilPanel' ) );

    const toolsPanel = new ToolsPanel( compass, fieldMeter, tandem.createTandem( 'toolsPanel' ) );

    super( {
      stretch: true,
      spacing: 10,
      children: [
        barMagnetPanel,
        pickupCoilPanel,
        toolsPanel
      ],
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilPanels', PickupCoilPanels );