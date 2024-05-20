// Copyright 2024, University of Colorado Boulder

/**
 * GeneratorPanels is the set of control panels on the ride side of the 'Generator' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import PickupCoilPanel from '../../common/view/PickupCoilPanel.js';
import BarMagnetPanel from '../../common/view/BarMagnetPanel.js';
import FELPanels from '../../common/view/FELPanels.js';
import { Node } from '../../../../scenery/js/imports.js';
import GeneratorScreenModel from '../model/GeneratorScreenModel.js';

export default class GeneratorPanels extends FELPanels {

  // These fields are provided solely for adding panels to the pdomOrder for PlayArea vs ControlPanel.
  public readonly barMagnetPanel: Node;
  public readonly pickupCoilPanel: Node;
  public readonly toolsPanel: Node;

  public constructor( model: GeneratorScreenModel, tandem: Tandem ) {

    const barMagnetPanel = new BarMagnetPanel( model.generator.turbine.barMagnet, model.compass, {
      hasFlipPolarityButton: false,
      tandem: tandem.createTandem( 'barMagnetPanel' )
    } );

    const pickupCoilPanel = new PickupCoilPanel( model.generator.pickupCoil,
      tandem.createTandem( 'pickupCoilPanel' ) );

    const toolsPanel = new ToolsPanel( model.compass, model.fieldMeter, {
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

faradaysElectromagneticLab.register( 'GeneratorPanels', GeneratorPanels );