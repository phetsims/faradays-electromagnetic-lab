// Copyright 2023, University of Colorado Boulder

/**
 * FELDeveloperAccordionBox is the base class for an accordion box that contains developer controls.
 * Run with &dev to add this to the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AccordionBox from '../../../../sun/js/AccordionBox.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Node, RichText, Text } from '../../../../scenery/js/imports.js';
import FELConstants from '../../common/FELConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import Utils from '../../../../dot/js/Utils.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';

const FONT_SIZE = 12;
const FONT = new PhetFont( FONT_SIZE );
const TEXT_OPTIONS = {
  font: FONT
};
const CHECKBOX_OPTIONS = {
  boxWidth: new Text( 'X', { font: FONT } ).height,
  tandem: Tandem.OPT_OUT
};
const TICK_LABEL_OPTIONS = {
  font: new PhetFont( FONT_SIZE - 2 )
};
const TRACK_SIZE = new Dimension2( 140, 4 );
const THUMB_SIZE = new Dimension2( 10, 20 );

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

  public static createMaxEMFControl( property: NumberProperty ): NumberControl {
    return new FELDeveloperNumberControl( 'Max EMF:', property, 0 /* decimalPlaces */ );
  }

  public static createTransitionSmoothingScaleControl( property: NumberProperty ): NumberControl {
    return new FELDeveloperNumberControl( 'Transition Smoothing Scale:', property, 2 /* decimalPlaces */ );
  }

  public static createElectronSpeedScaleControl( property: NumberProperty ): NumberControl {
    return new FELDeveloperNumberControl( 'Electron Speed Scale:', property, 1 /* decimalPlaces */ );
  }

  public static createLightBulbGlowScaleControl( property: NumberProperty ): NumberControl {
    return new FELDeveloperNumberControl( 'Light Bulb Glow Scale:', property, 1 /* decimalPlaces */ );
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

    const sliderStep = Utils.toFixedNumber( Math.pow( 10, -decimalPlaces ), decimalPlaces );

    super( labelString, numberProperty, range, {
      delta: sliderStep,
      layoutFunction: NumberControl.createLayoutFunction1( {
        align: 'left',
        arrowButtonsXSpacing: 4,
        ySpacing: 8
      } ),
      titleNodeOptions: {
        font: FONT
      },
      sliderOptions: {
        soundGenerator: null,
        constrainValue: value => Utils.roundToInterval( value, sliderStep ),
        majorTicks: majorTicks,
        trackSize: TRACK_SIZE,
        thumbSize: THUMB_SIZE,
        thumbTouchAreaXDilation: 5,
        thumbTouchAreaYDilation: 5,
        majorTickLength: 10
      },
      numberDisplayOptions: {
        decimalPlaces: decimalPlaces,
        maxWidth: 100,
        textOptions: {
          font: FONT
        }
      },
      tandem: Tandem.OPT_OUT
    } );
  }
}

faradaysElectromagneticLab.register( 'FELDeveloperAccordionBox', FELDeveloperAccordionBox );