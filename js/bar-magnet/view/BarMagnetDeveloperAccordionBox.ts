// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetDeveloperAccordionBox contains developer controls for the 'Bar Magnet' screen.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { VBox } from '../../../../scenery/js/imports.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import BarMagnetModel from '../model/BarMagnetModel.js';
import FELDeveloperNumberControl from '../../common/view/FELDeveloperNumberControl.js';

export default class BarMagnetDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( model: BarMagnetModel ) {

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        FELDeveloperNumberControl.createFieldScaleControl( model.barMagnet.fieldScaleProperty )
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetDeveloperAccordionBox', BarMagnetDeveloperAccordionBox );