// Copyright 2023-2025, University of Colorado Boulder

/**
 * GeneratorDeveloperAccordionBox contains developer controls for the 'Generator' screen.
 * Run with &dev query parameter to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import FELDeveloperAccordionBox from '../../common/view/FELDeveloperAccordionBox.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Generator from '../model/Generator.js';

export default class GeneratorDeveloperAccordionBox extends FELDeveloperAccordionBox {

  public constructor( generator: Generator ) {

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        FELDeveloperAccordionBox.createFieldScaleControl( generator.turbine.barMagnet.fieldScaleProperty ),
        new HSeparator(),
        FELDeveloperAccordionBox.createPickupCoilControls( generator.pickupCoil )
      ]
    } );

    super( content );
  }
}

faradaysElectromagneticLab.register( 'GeneratorDeveloperAccordionBox', GeneratorDeveloperAccordionBox );