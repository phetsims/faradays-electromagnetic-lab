// Copyright 2024, University of Colorado Boulder

/**
 * PickupCoilPanels is the set of control panels for the 'Pickup Coil' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import PickupCoilPanel from '../../common/view/PickupCoilPanel.js';
import BarMagnetPanel from '../../common/view/BarMagnetPanel.js';
import Property from '../../../../axon/js/Property.js';
import FELPanels from '../../common/view/FELPanels.js';
import { Node } from '../../../../scenery/js/imports.js';
import PickupCoilScreenModel from '../model/PickupCoilScreenModel.js';

export default class PickupCoilPanels extends FELPanels {

  // These fields are provided solely for adding panels to the pdomOrder for PlayArea vs ControlPanel.
  public readonly barMagnetPanel: Node;
  public readonly pickupCoilPanel: Node;
  public readonly toolsPanel: Node;

  public constructor( model: PickupCoilScreenModel, isLockedToAxisProperty: Property<boolean>, tandem: Tandem ) {

    const barMagnetPanel = new BarMagnetPanel( model.barMagnet, model.compass, {
      tandem: tandem.createTandem( 'barMagnetPanel' )
    } );

    const pickupCoilPanel = new PickupCoilPanel( model.pickupCoil, tandem.createTandem( 'pickupCoilPanel' ) );

    const toolsPanel = new ToolsPanel( model.compass, model.fieldMeter, {
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