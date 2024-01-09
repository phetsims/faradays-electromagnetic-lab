// Copyright 2023-2024, University of Colorado Boulder

//TODO Use MappedProperty here to convert from loopAreaProperty to percent, for slider alt input?

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

  public constructor( loopAreaProperty: NumberProperty, tandem: Tandem ) {

    const loopAreaRange = loopAreaProperty.rangeProperty.value;

    const majorTicks = [

      // 20%
      {
        value: loopAreaRange.min,
        label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
          value: Utils.roundToInterval( 100 * loopAreaRange.min / loopAreaRange.max, 1 )
        } ), FELConstants.TICK_LABEL_OPTIONS )
      },

      // 100%
      {
        value: loopAreaRange.max,
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
        numberFormatter: loopArea => StringUtils.fillIn( valuePercentStringProperty, {
          value: Utils.roundToInterval( 100 * loopArea / loopAreaRange.max, 1 )
        } ),
        numberFormatterDependencies: [ valuePercentStringProperty ]
      },
      sliderOptions: {
        constrainValue: ( value: number ) => Utils.roundToInterval( value, SLIDER_STEP ),
        majorTicks: majorTicks
        //TODO alt input options
        // keyboardStep: ?,
        // shiftKeyboardStep: ?,
        // pageKeyboardStep: ?
      },
      tandem: tandem
    } );

    super( FaradaysElectromagneticLabStrings.loopAreaStringProperty, loopAreaProperty, loopAreaRange, options );
  }
}

faradaysElectromagneticLab.register( 'LoopRadiusControl', LoopRadiusControl );