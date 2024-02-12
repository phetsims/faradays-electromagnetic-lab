// Copyright 2024, University of Colorado Boulder

/**
 * PickupCoilPanels is the set of control panels for the 'Pickup Coil' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Compass from '../../common/model/Compass.js';
import PickupCoilPanel from '../../common/view/PickupCoilPanel.js';
import PickupCoil from '../../common/model/PickupCoil.js';
import BarMagnetPanel from '../../common/view/BarMagnetPanel.js';
import BarMagnet from '../../common/model/BarMagnet.js';
import Property from '../../../../axon/js/Property.js';
import FELPanels from '../../common/view/FELPanels.js';
import { Node } from '../../../../scenery/js/imports.js';

export default class PickupCoilPanels extends FELPanels {

  // For putting panels in pdomOrder for PlayArea vs ControlPanel
  public readonly barMagnetPanel: Node;
  public readonly pickupCoilPanel: Node;
  public readonly toolsPanel: Node;

  public constructor( barMagnet: BarMagnet, pickupCoil: PickupCoil, compass: Compass, fieldMeter: FieldMeter,
                      isLockedToAxisProperty: Property<boolean>, tandem: Tandem ) {

    const barMagnetPanel = new BarMagnetPanel( barMagnet, compass, {
      tandem: tandem.createTandem( 'barMagnetPanel' )
    } );

    const pickupCoilPanel = new PickupCoilPanel( pickupCoil, tandem.createTandem( 'pickupCoilPanel' ) );

    const toolsPanel = new ToolsPanel( compass, fieldMeter, {
      isLockedToAxisProperty: isLockedToAxisProperty,
      tandem: tandem.createTandem( 'toolsPanel' )
    } );

    super( {
      children: [ barMagnetPanel, pickupCoilPanel, toolsPanel ],
      tandem: tandem
    } );

    this.barMagnetPanel = barMagnetPanel;
    this.pickupCoilPanel = pickupCoilPanel;
    this.toolsPanel = toolsPanel;
  }
}

faradaysElectromagneticLab.register( 'PickupCoilPanels', PickupCoilPanels );