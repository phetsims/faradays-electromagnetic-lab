// Copyright 2023, University of Colorado Boulder

/**
 * ElectromagnetPanels is the set of control panels for the 'Electromagnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Compass from '../../common/model/Compass.js';
import ElectromagnetPanel from '../../common/view/ElectromagnetPanel.js';
import Electromagnet from '../../common/model/Electromagnet.js';

export default class ElectromagnetPanels extends VBox {

  public constructor( electromagnet: Electromagnet, compass: Compass, fieldMeter: FieldMeter, tandem: Tandem ) {

    const electromagnetPanel = new ElectromagnetPanel( electromagnet, tandem.createTandem( 'electromagnetPanel' ) );

    const toolsPanel = new ToolsPanel( compass, fieldMeter, tandem.createTandem( 'toolsPanel' ) );

    super( {
      stretch: true,
      spacing: 10,
      children: [
        electromagnetPanel,
        toolsPanel
      ],
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetPanels', ElectromagnetPanels );