// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELDeveloperAccordionBox is the base class for an accordion box that contains developer controls. In addition to
 * styling the accordion box, it includes static methods for creating the developer controls needed throughout the
 * simulation.
 *
 * Run with &dev query parameter to add this to the sim.
 *
 * See the Property associated with each control for documentation about its semantics, how to adjust it, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AccordionBox from '../../../../sun/js/AccordionBox.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Node, Text, VBox } from '../../../../scenery/js/imports.js';
import FELConstants from '../../common/FELConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import PickupCoil from '../model/PickupCoil.js';
import Electromagnet from '../model/Electromagnet.js';
import { FELDeveloperNumberControl } from './FELDeveloperNumberControl.js';

// Developer controls are styled independently of controls in the UI, so that we can cram more of them in.
const CONTROL_FONT_SIZE = 12;
const CONTROL_FONT = new PhetFont( CONTROL_FONT_SIZE );
const TEXT_OPTIONS = {
  font: CONTROL_FONT
};
const SUBTITLE_OPTIONS = {
  font: new PhetFont( {
    size: CONTROL_FONT_SIZE + 2,
    weight: 'bold'
  } )
};
const CHECKBOX_OPTIONS = {
  boxWidth: new Text( 'X', { font: CONTROL_FONT } ).height,
  tandem: Tandem.OPT_OUT
};

const VBOX_SPACING = 15;

export default class FELDeveloperAccordionBox extends AccordionBox {

  protected constructor( content: Node ) {

    const titleText = new Text( 'Developer', {
      font: FELConstants.CONTROL_FONT
    } );

    super( content, {
      isDisposable: false,
      visible: !!phet.chipper.queryParameters.dev, // Run with &dev query parameter to make this visible.
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

  protected static createFieldScaleControl( property: NumberProperty ): NumberControl {
    return new FELDeveloperNumberControl( 'Field Scale:', property, 2 /* decimalPlaces */ );
  }

  /**
   * Creates the set of controls related to the pickup coil.
   */
  protected static createPickupCoilControls( pickupCoil: PickupCoil ): VBox {
    return new VBox( {
      align: 'left',
      spacing: VBOX_SPACING,
      children: [
        new Text( 'Pickup Coil', SUBTITLE_OPTIONS ),
        new FELDeveloperNumberControl( 'Max EMF:', pickupCoil.maxEMFProperty, 0 /* decimalPlaces */, true /* useCommaSeparator */ ),
        new FELDeveloperNumberControl( 'Transition Smoothing Scale:', pickupCoil.transitionSmoothingScaleProperty, 2 /* decimalPlaces */ ),
        new FELDeveloperNumberControl( 'Current Speed Scale:', pickupCoil.coil.currentSpeedScaleProperty, 1 /* decimalPlaces */ ),
        new FELDeveloperCheckbox( 'Sample Points', pickupCoil.samplePointsVisibleProperty ),
        new FELDeveloperCheckbox( 'Debugger Panel', pickupCoil.debuggerPanelVisibleProperty )
      ]
    } );
  }

  /**
   * Creates the set of controls related to the electromagnet.
   */
  protected static createElectromagnetControls( electromagnet: Electromagnet ): VBox {
    return new VBox( {
      align: 'left',
      spacing: VBOX_SPACING,
      children: [
        new Text( 'Electromagnet', SUBTITLE_OPTIONS ),
        new FELDeveloperNumberControl( 'Current Speed Scale:', electromagnet.coil.currentSpeedScaleProperty, 1 /* decimalPlaces */ ),
        new FELDeveloperCheckbox( 'Electromagnet Shape', electromagnet.shapeVisibleProperty )
      ]
    } );
  }
}

class FELDeveloperCheckbox extends Checkbox {
  public constructor( labelString: string, property: Property<boolean> ) {
    super( property, new Text( labelString, TEXT_OPTIONS ), CHECKBOX_OPTIONS );
  }
}

faradaysElectromagneticLab.register( 'FELDeveloperAccordionBox', FELDeveloperAccordionBox );