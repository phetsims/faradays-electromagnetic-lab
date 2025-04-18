// Copyright 2024-2025, University of Colorado Boulder

/**
 * ElectromagnetPanels is the set of control panels on the ride side of the 'Electromagnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ElectromagnetPanel from '../../common/view/ElectromagnetPanel.js';
import FELPanels from '../../common/view/FELPanels.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import ElectromagnetScreenModel from '../model/ElectromagnetScreenModel.js';

export default class ElectromagnetPanels extends FELPanels {

  // These fields are provided solely for adding panels to the pdomOrder for PlayArea vs ControlPanel.
  public readonly electromagnetPanel: Node;
  public readonly toolsPanel: Node;

  public constructor( model: ElectromagnetScreenModel, tandem: Tandem ) {

    const electromagnetPanel = new ElectromagnetPanel( model.electromagnet, tandem.createTandem( 'electromagnetPanel' ) );

    const toolsPanel = new ToolsPanel( model.compass, model.fieldMeter, {
      tandem: tandem.createTandem( 'toolsPanel' )
    } );

    super( {
      children: [ electromagnetPanel, toolsPanel ],
      tandem: tandem
    } );

    this.electromagnetPanel = electromagnetPanel;
    this.toolsPanel = toolsPanel;
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetPanels', ElectromagnetPanels );