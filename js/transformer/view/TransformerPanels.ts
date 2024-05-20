// Copyright 2024, University of Colorado Boulder

/**
 * TransformerPanels is the set of control panels on the ride side of the 'Transformer' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import PickupCoilPanel from '../../common/view/PickupCoilPanel.js';
import ElectromagnetPanel from '../../common/view/ElectromagnetPanel.js';
import Property from '../../../../axon/js/Property.js';
import FELPanels from '../../common/view/FELPanels.js';
import { Node } from '../../../../scenery/js/imports.js';
import TransformerScreenModel from '../model/TransformerScreenModel.js';

export default class TransformerPanels extends FELPanels {

  // These fields are provided solely for adding panels to the pdomOrder for PlayArea vs ControlPanel.
  public readonly electromagnetPanel: Node;
  public readonly pickupCoilPanel: Node;
  public readonly toolsPanel: Node;

  public constructor( model: TransformerScreenModel, isLockedToAxisProperty: Property<boolean>, tandem: Tandem ) {

    const electromagnetPanel = new ElectromagnetPanel( model.transformer.electromagnet, tandem.createTandem( 'electromagnetPanel' ) );

    const pickupCoilPanel = new PickupCoilPanel( model.transformer.pickupCoil, tandem.createTandem( 'pickupCoilPanel' ) );

    const toolsPanel = new ToolsPanel( model.compass, model.fieldMeter, {
      isLockedToAxisProperty: isLockedToAxisProperty,
      tandem: tandem.createTandem( 'toolsPanel' )
    } );

    super( {
      children: [ electromagnetPanel, pickupCoilPanel, toolsPanel ],
      tandem: tandem
    } );

    this.electromagnetPanel = electromagnetPanel;
    this.pickupCoilPanel = pickupCoilPanel;
    this.toolsPanel = toolsPanel;
  }
}

faradaysElectromagneticLab.register( 'TransformerPanels', TransformerPanels );