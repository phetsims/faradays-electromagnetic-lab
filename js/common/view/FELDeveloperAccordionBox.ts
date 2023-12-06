// Copyright 2023, University of Colorado Boulder

/**
 * FELDeveloperAccordionBox is the base class for an accordion box that contains developer controls.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import FELConstants from '../../common/FELConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';


export default class FELDeveloperAccordionBox extends AccordionBox {

  protected constructor( content: Node ) {

    const titleText = new Text( 'Developer Controls', {
      font: FELConstants.CONTROL_FONT
    } );

    super( content, combineOptions<AccordionBoxOptions>( {}, FELConstants.ACCORDION_BOX_OPTIONS, {
      isDisposable: false,
      titleNode: titleText,
      expandedProperty: new BooleanProperty( false ),
      tandem: Tandem.OPT_OUT
    } ) );
  }
}

faradaysElectromagneticLab.register( 'FELDeveloperAccordionBox', FELDeveloperAccordionBox );