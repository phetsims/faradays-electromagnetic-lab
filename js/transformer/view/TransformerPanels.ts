// Copyright 2024, University of Colorado Boulder

/**
 * TransformerPanels is the set of control panels for the 'Transformer' screen.
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
import Electromagnet from '../../common/model/Electromagnet.js';
import ElectromagnetPanel from '../../common/view/ElectromagnetPanel.js';

export default class TransformerPanels extends VBox {

  public constructor( electromagnet: Electromagnet, pickupCoil: PickupCoil, compass: Compass, fieldMeter: FieldMeter, tandem: Tandem ) {

    const electromagnetPanel = new ElectromagnetPanel( electromagnet, tandem.createTandem( 'electromagnetPanel' ) );

    const pickupCoilPanel = new PickupCoilPanel( pickupCoil, tandem.createTandem( 'pickupCoilPanel' ) );

    const toolsPanel = new ToolsPanel( compass, fieldMeter, tandem.createTandem( 'toolsPanel' ) );

    super( {
      stretch: true,
      spacing: 10,
      children: [
        electromagnetPanel,
        pickupCoilPanel,
        toolsPanel
      ],
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );
  }
}

faradaysElectromagneticLab.register( 'TransformerPanels', TransformerPanels );