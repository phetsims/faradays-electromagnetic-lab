// Copyright 2024-2025, University of Colorado Boulder

/**
 * PickupCoilPanels is the set of control panels on the ride side of the 'Pickup Coil' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnetPanel from '../../common/view/BarMagnetPanel.js';
import FELPanels from '../../common/view/FELPanels.js';
import PickupCoilPanel from '../../common/view/PickupCoilPanel.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickupCoilScreenModel from '../model/PickupCoilScreenModel.js';

export default class PickupCoilPanels extends FELPanels {

  // These fields are provided solely for adding panels to the pdomOrder for PlayArea vs ControlPanel.
  public readonly barMagnetPanel: Node;
  public readonly pickupCoilPanel: Node;
  public readonly toolsPanel: Node;

  public constructor( model: PickupCoilScreenModel, lockToAxisProperty: Property<boolean>, tandem: Tandem ) {

    const barMagnetPanel = new BarMagnetPanel( model.barMagnet, model.compass, {
      hasFlipPolarityButton: false, // to address https://github.com/phetsims/faradays-electromagnetic-lab/issues/180
      tandem: tandem.createTandem( 'barMagnetPanel' )
    } );

    const pickupCoilPanel = new PickupCoilPanel( model.pickupCoil, tandem.createTandem( 'pickupCoilPanel' ) );

    const toolsPanel = new ToolsPanel( model.compass, model.fieldMeter, {
      lockToAxisProperty: lockToAxisProperty,
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