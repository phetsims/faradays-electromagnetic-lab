// Copyright 2024, University of Colorado Boulder

/**
 * TransformerPanels is the set of control panels for the 'Transformer' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Compass from '../../common/model/Compass.js';
import PickupCoilPanel from '../../common/view/PickupCoilPanel.js';
import ElectromagnetPanel from '../../common/view/ElectromagnetPanel.js';
import Property from '../../../../axon/js/Property.js';
import FELPanels from '../../common/view/FELPanels.js';
import Transformer from '../model/Transformer.js';

export default class TransformerPanels extends FELPanels {

  public constructor( transformer: Transformer, compass: Compass, fieldMeter: FieldMeter,
                      isLockedToAxisProperty: Property<boolean>, tandem: Tandem ) {

    const electromagnetPanel = new ElectromagnetPanel( transformer.electromagnet, tandem.createTandem( 'electromagnetPanel' ) );

    const pickupCoilPanel = new PickupCoilPanel( transformer.pickupCoil, tandem.createTandem( 'pickupCoilPanel' ) );

    const toolsPanel = new ToolsPanel( compass, fieldMeter, {
      isLockedToAxisProperty: isLockedToAxisProperty,
      tandem: tandem.createTandem( 'toolsPanel' )
    } );

    super( {
      children: [ electromagnetPanel, pickupCoilPanel, toolsPanel ],
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'TransformerPanels', TransformerPanels );