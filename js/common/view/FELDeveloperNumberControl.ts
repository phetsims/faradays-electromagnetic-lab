// Copyright 2023, University of Colorado Boulder

/**
 * FELDeveloperNumberControl is a NumberControl used in the 'Developer Controls' accordion box,
 * added to the sim by running with &dev.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import { RichText } from '../../../../scenery/js/imports.js';

const TICK_LABEL_OPTIONS = {
  font: FELConstants.TICK_LABEL_FONT
};

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

    const options = combineOptions<NumberControlOptions>( {}, FELConstants.NUMBER_CONTROL_OPTIONS, {
      delta: decimalPlaces,
      numberDisplayOptions: {
        decimalPlaces: decimalPlaces
      },
      sliderOptions: {
        constrainValue: value => Utils.roundToInterval( value, sliderStep ),
        majorTicks: majorTicks
      },
      tandem: Tandem.OPT_OUT
    } );

    super( labelString, numberProperty, range, options );
  }

  public static createFieldScaleControl( fieldScaleProperty: NumberProperty ): NumberControl {
    return new FELDeveloperNumberControl( 'Field Scale:', fieldScaleProperty, 2 );
  }
}

faradaysElectromagneticLab.register( 'FELDeveloperNumberControl', FELDeveloperNumberControl );