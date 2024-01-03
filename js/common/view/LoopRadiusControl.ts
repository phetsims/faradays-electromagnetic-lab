// Copyright 2023-2024, University of Colorado Boulder

//TODO Change to 'Loop Area'.
//TODO Use MappedProperty here to convert from loopRadiusProperty to percent?

/**
 * LoopRadiusControl controls the radius of all loops in a pickup coil. The control shows values in %.
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
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

const valuePercentStringProperty = FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty;
const SLIDER_STEP = 1;

export default class LoopRadiusControl extends NumberControl {

  public constructor( loopRadiusProperty: NumberProperty, tandem: Tandem ) {

    const loopRadiusRange = loopRadiusProperty.rangeProperty.value;

    const majorTicks = [

      // 45%
      {
        value: loopRadiusRange.min,
        label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
          value: Utils.roundToInterval( 100 * loopRadiusRange.min / loopRadiusRange.max, 1 )
        } ), FELConstants.TICK_LABEL_OPTIONS )
      },

      // 100%
      {
        value: loopRadiusRange.max,
        label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
          value: 100
        } ), FELConstants.TICK_LABEL_OPTIONS )
      }
    ];

    const options = combineOptions<NumberControlOptions>( {}, FELConstants.NUMBER_CONTROL_OPTIONS, {
      isDisposable: false,
      delta: SLIDER_STEP,
      numberDisplayOptions: {
        decimalPlaces: 0,

        //TODO This will not immediately update when valuePercentStringProperty changes.
        numberFormatter: loopRadius => StringUtils.fillIn( valuePercentStringProperty, {
          value: Utils.roundToInterval( 100 * loopRadius / loopRadiusRange.max, 1 )
        } )
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

    super( FaradaysElectromagneticLabStrings.loopRadiusStringProperty, loopRadiusProperty, loopRadiusRange, options );
  }
}

faradaysElectromagneticLab.register( 'LoopRadiusControl', LoopRadiusControl );