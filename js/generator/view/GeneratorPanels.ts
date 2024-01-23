// Copyright 2024, University of Colorado Boulder

/**
 * GeneratorPanels is the set of control panels for the 'Generator' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Compass from '../../common/model/Compass.js';
import PickupCoilPanel from '../../common/view/PickupCoilPanel.js';
import PickupCoil from '../../common/model/PickupCoil.js';
import BarMagnetPanel from '../../common/view/BarMagnetPanel.js';
import Turbine from '../model/Turbine.js';
import FELPanels from '../../common/view/FELPanels.js';

export default class GeneratorPanels extends FELPanels {

  public constructor( turbine: Turbine, pickupCoil: PickupCoil, compass: Compass, fieldMeter: FieldMeter, tandem: Tandem ) {

    const barMagnetPanel = new BarMagnetPanel( turbine, compass, {
      hasFlipPolarityButton: false,
      tandem: tandem.createTandem( 'barMagnetPanel' )
    } );

    const pickupCoilPanel = new PickupCoilPanel( pickupCoil, tandem.createTandem( 'pickupCoilPanel' ) );

    const toolsPanel = new ToolsPanel( compass, fieldMeter, {
      tandem: tandem.createTandem( 'toolsPanel' )
    } );

    super( {
      children: [ barMagnetPanel, pickupCoilPanel, toolsPanel ],
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'GeneratorPanels', GeneratorPanels );