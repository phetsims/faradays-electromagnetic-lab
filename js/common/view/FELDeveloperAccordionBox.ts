// Copyright 2023, University of Colorado Boulder

/**
 * FELDeveloperAccordionBox is the base class for an accordion box that contains developer controls.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AccordionBox from '../../../../sun/js/AccordionBox.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import FELConstants from '../../common/FELConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

const FONT = new PhetFont( 10 );
const TEXT_OPTIONS = {
  font: FONT
};
const CHECKBOX_OPTIONS = {
  boxWidth: new Text( 'X', { font: FONT } ).height,
  tandem: Tandem.OPT_OUT
};

export default class FELDeveloperAccordionBox extends AccordionBox {

  protected constructor( content: Node ) {

    const titleText = new Text( 'Developer Controls', {
      font: FELConstants.CONTROL_FONT
    } );

    super( content, {
      isDisposable: false,
      expandedProperty: new BooleanProperty( false ),
      titleNode: titleText,
      titleXMargin: 8,
      titleYMargin: 6,
      titleXSpacing: 10,
      titleAlignX: 'left',
      buttonXMargin: 8,
      buttonYMargin: 6,
      contentXMargin: 12,
      contentYMargin: 10,
      tandem: Tandem.OPT_OUT
    } );
  }

  public static createElectromagnetShapeVisibleCheckbox( property: Property<boolean> ): Checkbox {
    const content = new Text( 'Electromagnet Shape', TEXT_OPTIONS );
    return new Checkbox( property, content, CHECKBOX_OPTIONS );
  }

  public static createPickupCoilSamplePointsVisibleCheckbox( property: Property<boolean> ): Checkbox {
    const content = new Text( 'Pickup Coil Sample Points', TEXT_OPTIONS );
    return new Checkbox( property, content, CHECKBOX_OPTIONS );
  }

  public static createPickupCoilFluxVisibleCheckbox( property: Property<boolean> ): Checkbox {
    const content = new Text( 'Pickup Coil Flux', TEXT_OPTIONS );
    return new Checkbox( property, content, CHECKBOX_OPTIONS );
  }
}

faradaysElectromagneticLab.register( 'FELDeveloperAccordionBox', FELDeveloperAccordionBox );