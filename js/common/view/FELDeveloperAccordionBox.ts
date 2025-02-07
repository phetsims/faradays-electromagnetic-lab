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

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Electromagnet from '../model/Electromagnet.js';
import PickupCoil from '../model/PickupCoil.js';
import { FELDeveloperNumberControl } from './FELDeveloperNumberControl.js';

const VBOX_SPACING = 15;

export default class FELDeveloperAccordionBox extends AccordionBox {

  public static readonly SUBTITLE_FONT = new PhetFont( {
    size: FELConstants.DEVELOPER_CONTROL_FONT.size,
    weight: 'bold'
  } );

  protected constructor( content: Node ) {

    const titleText = new Text( 'Developer', {
      font: FELConstants.DEVELOPER_CONTROL_FONT
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
    return new FELDeveloperNumberControl( 'Field Scale:', property, {
      decimalPlaces: 2
    } );
  }

  /**
   * Creates the set of controls related to the pickup coil.
   */
  protected static createPickupCoilControls( pickupCoil: PickupCoil ): VBox {

    return new VBox( {
      align: 'left',
      spacing: VBOX_SPACING,
      children: [
        new Text( 'Pickup Coil', {
          font: FELDeveloperAccordionBox.SUBTITLE_FONT
        } ),
        new FELDeveloperNumberControl( 'Max EMF:', pickupCoil.maxEMFProperty, {
          useCommaSeparator: true,
          delta: 100 // for arrow buttons
        } ),
        new FELDeveloperNumberControl( 'Transition Smoothing Scale:', pickupCoil.transitionSmoothingScaleProperty, {
          decimalPlaces: 2
        } ),
        new FELDeveloperNumberControl( 'Current Speed Scale:', pickupCoil.coil.currentSpeedScaleProperty, {
          decimalPlaces: 1
        } ),
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
        new Text( 'Electromagnet', {
          font: FELDeveloperAccordionBox.SUBTITLE_FONT
        } ),
        new FELDeveloperNumberControl( 'Current Speed Scale:', electromagnet.coil.currentSpeedScaleProperty, {
          decimalPlaces: 1
        } ),
        new FELDeveloperCheckbox( 'Electromagnet Shape', electromagnet.shapeVisibleProperty )
      ]
    } );
  }
}

class FELDeveloperCheckbox extends Checkbox {
  public constructor( labelString: string, property: Property<boolean> ) {
    const text = new Text( labelString, {
      font: FELConstants.DEVELOPER_CONTROL_FONT
    } );
    super( property, text, {
      boxWidth: new Text( 'X', { font: FELConstants.DEVELOPER_CONTROL_FONT } ).height,
      tandem: Tandem.OPT_OUT
    } );
  }
}

faradaysElectromagneticLab.register( 'FELDeveloperAccordionBox', FELDeveloperAccordionBox );