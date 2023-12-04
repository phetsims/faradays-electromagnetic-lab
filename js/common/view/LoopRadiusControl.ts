// Copyright 2023, University of Colorado Boulder

/**
 * LoopRadiusControl controls the radius of all loops in a pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import { RichText } from '../../../../scenery/js/imports.js';
import MappedProperty from '../../../../axon/js/MappedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Range from '../../../../dot/js/Range.js';

const SLIDER_STEP = 1;
const TICK_LABEL_OPTIONS = {
  font: FELConstants.TICK_LABEL_FONT
};

export default class LoopRadiusControl extends NumberControl {

  public constructor( loopRadiusProperty: NumberProperty, tandem: Tandem ) {

    // loopRadiusProperty is a unitless dimension, while this control is in %.
    const percentProperty = new MappedProperty<number, number>( loopRadiusProperty, {
      phetioValueType: NumberIO,
      reentrant: true,
      bidirectional: true,

      // loopRadius => %
      map: ( loopRadius: number ) => 100 * loopRadius / loopRadiusProperty.range.max,

      // % => loopRadius
      inverseMap: ( percent: number ) => ( percent / 100 ) * loopRadiusProperty.range.max
    } );

    const minPercent = Math.ceil( 100 * loopRadiusProperty.rangeProperty.value.min / loopRadiusProperty.rangeProperty.value.max );
    const percentRange = new Range( minPercent, 100 );

    const majorTicks = [

      // 45%
      {
        value: percentRange.min,
        label: new RichText( new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty, {
          value: percentRange.min
        } ), TICK_LABEL_OPTIONS )
      },

      // 100%
      {
        value: percentRange.max,
        label: new RichText( new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty, {
          value: percentRange.max
        } ), TICK_LABEL_OPTIONS )
      }
    ];

    const options = combineOptions<NumberControlOptions>( {}, FELConstants.NUMBER_CONTROL_OPTIONS, {
      delta: SLIDER_STEP,
      numberDisplayOptions: {
        decimalPlaces: 0,
        valuePattern: FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty
      },
      sliderOptions: {
        constrainValue: ( value: number ) => Utils.roundToInterval( value, SLIDER_STEP ),
        keyboardStep: 5,
        shiftKeyboardStep: 1,
        pageKeyboardStep: 10,
        majorTicks: majorTicks
      },
      tandem: tandem
    } );

    super(
      FaradaysElectromagneticLabStrings.loopRadiusStringProperty,
      percentProperty,
      percentRange,
      options
    );
  }
}

faradaysElectromagneticLab.register( 'LoopRadiusControl', LoopRadiusControl );