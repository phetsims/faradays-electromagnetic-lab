// Copyright 2023, University of Colorado Boulder

/**
 * FieldIntensityScaleControl is a developer control for scaling the intensity of the magnet field visualization.
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

const DECIMAL_PLACES = 2;
const SLIDER_STEP = Utils.toFixedNumber( Math.pow( 10, -DECIMAL_PLACES ), DECIMAL_PLACES );
const TICK_LABEL_OPTIONS = {
  font: FELConstants.TICK_LABEL_FONT
};

export default class FieldIntensityScaleControl extends NumberControl {

  public constructor( fieldIntensityScaleProperty: NumberProperty ) {

    const range = fieldIntensityScaleProperty.range;

    const majorTicks = [

      // min
      {
        value: range.min,
        label: new RichText( range.min, TICK_LABEL_OPTIONS )
      },

      // max
      {
        value: range.max,
        label: new RichText( range.max, TICK_LABEL_OPTIONS )
      }
    ];

    const options = combineOptions<NumberControlOptions>( {}, FELConstants.NUMBER_CONTROL_OPTIONS, {
      delta: SLIDER_STEP,
      numberDisplayOptions: {
        decimalPlaces: DECIMAL_PLACES
      },
      sliderOptions: {
        constrainValue: ( value: number ) => Utils.roundToInterval( value, SLIDER_STEP ),
        majorTicks: majorTicks
      },
      tandem: Tandem.OPT_OUT
    } );

    super( 'Field intensity scale:', fieldIntensityScaleProperty, range, options );
  }
}

faradaysElectromagneticLab.register( 'FieldIntensityScaleControl', FieldIntensityScaleControl );