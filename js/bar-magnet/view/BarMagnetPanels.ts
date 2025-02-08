// Copyright 2024-2025, University of Colorado Boulder

/**
 * BarMagnetPanels is the set of control panels on the ride side of the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnetPanel from '../../common/view/BarMagnetPanel.js';
import FELPanels from '../../common/view/FELPanels.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnetScreenModel from '../model/BarMagnetScreenModel.js';

export default class BarMagnetPanels extends FELPanels {

  // These fields are provided solely for adding panels to the pdomOrder for PlayArea vs ControlPanel.
  public readonly barMagnetPanel: Node;
  public readonly toolsPanel: Node;

  public constructor( model: BarMagnetScreenModel,
                      seeInsideBarMagnetProperty: Property<boolean>,
                      earthVisibleProperty: Property<boolean>,
                      addEarthCheckboxProperty: TReadOnlyProperty<boolean>,
                      tandem: Tandem ) {

    const barMagnetPanel = new BarMagnetPanel( model.barMagnet, model.compass, {
      seeInsideProperty: seeInsideBarMagnetProperty,
      addEarthCheckboxProperty: addEarthCheckboxProperty,
      earthVisibleProperty: earthVisibleProperty,
      tandem: tandem.createTandem( 'barMagnetPanel' )
    } );

    const toolsPanel = new ToolsPanel( model.compass, model.fieldMeter, {
      tandem: tandem.createTandem( 'toolsPanel' )
    } );

    super( {
      children: [ barMagnetPanel, toolsPanel ],
      tandem: tandem
    } );

    this.barMagnetPanel = barMagnetPanel;
    this.toolsPanel = toolsPanel;
  }
}

faradaysElectromagneticLab.register( 'BarMagnetPanels', BarMagnetPanels );