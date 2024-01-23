// Copyright 2024, University of Colorado Boulder

/**
 * BarMagnetPanels is the set of control panels for the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnetPanel from '../../common/view/BarMagnetPanel.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import BarMagnetViewProperties from './BarMagnetViewProperties.js';
import BarMagnet from '../../common/model/BarMagnet.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Compass from '../../common/model/Compass.js';
import FELPanels from '../../common/view/FELPanels.js';

export default class BarMagnetPanels extends FELPanels {

  public constructor( barMagnet: BarMagnet, compass: Compass, fieldMeter: FieldMeter,
                      viewProperties: BarMagnetViewProperties, tandem: Tandem ) {

    const barMagnetPanel = new BarMagnetPanel( barMagnet, compass, {
      seeInsideProperty: viewProperties.seeInsideBarMagnetProperty,
      earthVisibleProperty: viewProperties.earthVisibleProperty,
      tandem: tandem.createTandem( 'barMagnetPanel' )
    } );

    const toolsPanel = new ToolsPanel( compass, fieldMeter, {
      tandem: tandem.createTandem( 'toolsPanel' )
    } );

    super( {
      children: [ barMagnetPanel, toolsPanel ],
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetPanels', BarMagnetPanels );