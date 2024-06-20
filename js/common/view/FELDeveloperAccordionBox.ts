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
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
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
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';

const VBOX_SPACING = 15;

export default class FELDeveloperAccordionBox extends AccordionBox {

  public static readonly CONTROL_FONT = new PhetFont( 12 );
  public static readonly SUBTITLE_FONT = new PhetFont( {
    size: 12,
    weight: 'bold'
  } );

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
        new MaxEMFDisplay( pickupCoil.emfProperty, pickupCoil.maxEMFProperty.range ),
        new FELDeveloperNumberControl( 'Max EMF:', pickupCoil.maxEMFProperty, {
          useCommaSeparator: true
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
      font: FELDeveloperAccordionBox.CONTROL_FONT
    } );
    super( property, text, {
      boxWidth: new Text( 'X', { font: FELDeveloperAccordionBox.CONTROL_FONT } ).height,
      tandem: Tandem.OPT_OUT
    } );
  }
}

class MaxEMFDisplay extends HBox {
  public constructor( emfProperty: TReadOnlyProperty<number>, emfRange: Range, decimalPlaces = 0 ) {

    const maxEMFProperty = new NumberProperty( emfProperty.value );
    emfProperty.link( emf => {
      if ( emf > maxEMFProperty.value ) {
        maxEMFProperty.value = emf;
      }
    } );

    const maxEMFText = new Text( 'Max EMF:', {
      font: FELDeveloperAccordionBox.CONTROL_FONT
    } );
    const maxEMFNumberDisplay = new NumberDisplay( maxEMFProperty, emfRange, {
      numberFormatter: value => FELDeveloperNumberControl.formatValue( value, decimalPlaces, true ),
      textOptions: {
        font: FELDeveloperAccordionBox.CONTROL_FONT
      }
    } );

    super( {
      children: [ maxEMFText, maxEMFNumberDisplay ],
      spacing: 5
    } );
  }
}

faradaysElectromagneticLab.register( 'FELDeveloperAccordionBox', FELDeveloperAccordionBox );