// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetDeveloperAccordionBox contains developer controls for the 'Bar Magnet' screen.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import FELConstants from '../../common/FELConstants.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import BarMagnetModel from '../model/BarMagnetModel.js';


export default class BarMagnetDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: BarMagnetModel ) {

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

faradaysElectromagneticLab.register( 'BarMagnetDeveloperAccordionBox', BarMagnetDeveloperAccordionBox );