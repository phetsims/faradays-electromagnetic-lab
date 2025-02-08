// Copyright 2023-2025, University of Colorado Boulder

/**
 * BarMagnetDeveloperAccordionBox contains developer controls for the 'Bar Magnet' screen.
 * Run with &dev query parameter to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import BarMagnet from '../../common/model/BarMagnet.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

export default class BarMagnetDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( barMagnet: BarMagnet ) {

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        FELDeveloperAccordionBox.createFieldScaleControl( barMagnet.fieldScaleProperty )
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetDeveloperAccordionBox', BarMagnetDeveloperAccordionBox );