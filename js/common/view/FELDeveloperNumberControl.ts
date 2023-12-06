// Copyright 2023, University of Colorado Boulder

/**
 * FELDeveloperNumberControl is a NumberControl used in the 'Developer Controls' accordion box,
 * added to the sim by running with &dev.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Utils from '../../../../dot/js/Utils.js';
import { RichText } from '../../../../scenery/js/imports.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

const FONT = new PhetFont( 10 );
const TICK_LABEL_OPTIONS = {
  font: new PhetFont( 8 )
};
const TRACK_SIZE = new Dimension2( 140, 4 );
const THUMB_SIZE = new Dimension2( 10, 20 );

export default class FELDeveloperNumberControl extends NumberControl {

  /**
   * Private - use static methods to create specific instances.
   */
  private constructor( labelString: string, numberProperty: NumberProperty, decimalPlaces: number ) {

    const range = numberProperty.range;

    // Tick marks at the extremes of the range
    const majorTicks = [
      {
        value: range.min,
        label: new RichText( Utils.toFixedNumber( range.min, decimalPlaces ), TICK_LABEL_OPTIONS )
      },
      {
        value: range.max,
        label: new RichText( Utils.toFixedNumber( range.max, decimalPlaces ), TICK_LABEL_OPTIONS )
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
        font: FONT,
        maxWidth: 140
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
}

faradaysElectromagneticLab.register( 'FELDeveloperNumberControl', FELDeveloperNumberControl );