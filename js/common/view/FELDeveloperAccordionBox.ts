// Copyright 2023, University of Colorado Boulder

/**
 * FELDeveloperAccordionBox is the base class for an accordion box that contains developer controls. In addition to
 * styling the accordion box, it includes static methods for creating the developer controls needed throughout the
 * simulation.
 *
 * Run with &dev to add this to the sim.
 *
 * See the Property associated with a control for documentation about its semantics, how to adjust it, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AccordionBox from '../../../../sun/js/AccordionBox.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { HBox, Node, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import FELConstants from '../../common/FELConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import NumberControl, { LayoutFunction } from '../../../../scenery-phet/js/NumberControl.js';
import Utils from '../../../../dot/js/Utils.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import ResetButton from '../../../../scenery-phet/js/buttons/ResetButton.js';
import PickupCoil from '../model/PickupCoil.js';
import LightBulb from '../model/LightBulb.js';

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
const TICK_LABEL_OPTIONS = {
  font: new PhetFont( CONTROL_FONT_SIZE - 2 )
};
const TRACK_SIZE = new Dimension2( 140, 1 );
const THUMB_SIZE = new Dimension2( 10, 20 );
const VBOX_SPACING = 15;

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

  public static createFieldScaleControl( property: NumberProperty ): NumberControl {
    return new FELDeveloperNumberControl( 'Field Scale:', property, 2 /* decimalPlaces */ );
  }

  public static createElectromagnetShapeCheckbox( property: Property<boolean> ): Checkbox {
    return new FELDeveloperCheckbox( 'Electromagnet Shape', property );
  }

  /**
   * Creates the set of controls related to the pickup coil and its indicators.
   */
  public static createPickupCoilControls( pickupCoil: PickupCoil, lightBulb: LightBulb ): VBox {
    return new VBox( {
      align: 'left',
      spacing: VBOX_SPACING,
      children: [
        new Text( 'Pickup Coil', SUBTITLE_OPTIONS ),
        new FELDeveloperNumberControl( 'Max EMF:', pickupCoil.maxEMFProperty, 0 /* decimalPlaces */ ),
        new FELDeveloperNumberControl( 'Transition Smoothing Scale:', pickupCoil.transitionSmoothingScaleProperty, 2 /* decimalPlaces */ ),
        new FELDeveloperNumberControl( 'Electron Speed Scale:', pickupCoil.electronSpeedScaleProperty, 1 /* decimalPlaces */ ),
        new FELDeveloperNumberControl( 'Light Bulb Scale:', lightBulb.glowScaleProperty, 1 /* decimalPlaces */ ),
        new FELDeveloperCheckbox( 'Sample Points', pickupCoil.samplePointsVisibleProperty ),
        new FELDeveloperCheckbox( 'Flux Display', pickupCoil.fluxVisibleProperty )
      ]
    } );
  }
}

class FELDeveloperCheckbox extends Checkbox {
  public constructor( labelString: string, property: Property<boolean> ) {
    super( property, new Text( labelString, TEXT_OPTIONS ), CHECKBOX_OPTIONS );
  }
}

class FELDeveloperNumberControl extends NumberControl {

  public constructor( labelString: string, numberProperty: NumberProperty, decimalPlaces: number ) {

    const range = numberProperty.range;

    // Tick marks at the extremes of the range
    const majorTicks = [
      {
        value: range.min,
        label: new RichText( Utils.toFixed( range.min, decimalPlaces ), TICK_LABEL_OPTIONS )
      },
      {
        value: range.max,
        label: new RichText( Utils.toFixed( range.max, decimalPlaces ), TICK_LABEL_OPTIONS )
      }
    ];

    // Since Properties related to developer controls are not affected by Reset All, add a reset button.
    const resetButton = new ResetButton( {
      listener: () => numberProperty.reset(),
      scale: 0.4
    } );

    const sliderStep = Utils.toFixedNumber( Math.pow( 10, -decimalPlaces ), decimalPlaces );

    super( labelString, numberProperty, range, {
      delta: sliderStep,
      layoutFunction: createLayoutFunction( resetButton ),
      titleNodeOptions: {
        font: CONTROL_FONT
      },
      sliderOptions: {
        soundGenerator: null,
        constrainValue: value => Utils.roundToInterval( value, sliderStep ),
        majorTicks: majorTicks,
        trackSize: TRACK_SIZE,
        trackFillEnabled: 'black',
        trackStroke: null,
        thumbSize: THUMB_SIZE,
        thumbTouchAreaXDilation: 5,
        thumbTouchAreaYDilation: 5,
        majorTickLength: 10,
        layoutOptions: {
          grow: 1
        }
      },
      numberDisplayOptions: {
        decimalPlaces: decimalPlaces,
        maxWidth: 100,
        textOptions: {
          font: CONTROL_FONT
        }
      },
      tandem: Tandem.OPT_OUT
    } );
  }
}

/**
 * Creates a NumberControl layout function that includes a reset button.
 */
function createLayoutFunction( resetButton: Node ): LayoutFunction {

  return ( titleNode, numberDisplay, slider, decrementButton, incrementButton ) => {
    assert && assert( decrementButton, 'decrementButton is required' );
    assert && assert( incrementButton, 'incrementButton is required' );

    return new VBox( {
      align: 'left',
      spacing: 4,
      children: [
        new HBox( {
          spacing: 5,
          children: [ titleNode, numberDisplay, resetButton ]
        } ),
        new HBox( {
          layoutOptions: {
            stretch: true
          },
          spacing: 4,
          children: [ decrementButton!, slider, incrementButton! ]
        } )
      ]
    } );
  };
}


faradaysElectromagneticLab.register( 'FELDeveloperAccordionBox', FELDeveloperAccordionBox );