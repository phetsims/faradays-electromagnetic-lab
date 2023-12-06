// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoilDeveloperAccordionBox contains developer controls for the 'Pickup Coil' screen.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import FELConstants from '../../common/FELConstants.js';
import PickupCoilModel from '../model/PickupCoilModel.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';


export default class PickupCoilDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: PickupCoilModel ) {

    const content = new VBox( {
      spacing: 10,
      children: [
        new Text( 'Under Construction', {
          font: FELConstants.CONTROL_FONT
        } )
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilDeveloperAccordionBox', PickupCoilDeveloperAccordionBox );