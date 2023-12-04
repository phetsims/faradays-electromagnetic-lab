// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetStrengthControl is the control for magnet strength. The control shows values in %.
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

const SLIDER_STEP = 1;
const TICK_LABEL_OPTIONS = {
  font: FELConstants.TICK_LABEL_FONT
};

export default class BarMagnetStrengthControl extends NumberControl {

  public constructor( strengthProperty: NumberProperty, tandem: Tandem ) {

    const strengthRange = strengthProperty.range;
    assert && assert( strengthRange.min === 0 );

    const majorTicks = [

      // 0%
      {
        value: strengthRange.min,
        label: new RichText( new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty, {
          value: 0
        } ), TICK_LABEL_OPTIONS )
      },

      // 50%
      {
        value: strengthRange.min + strengthRange.getLength() / 2,
        label: new RichText( new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty, {
          value: 50
        } ), TICK_LABEL_OPTIONS )
      },

      // 100%
      {
        value: strengthRange.max,
        label: new RichText( new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty, {
          value: 100
        } ), TICK_LABEL_OPTIONS )
      }
    ];

    const options = combineOptions<NumberControlOptions>( {}, FELConstants.NUMBER_CONTROL_OPTIONS, {
      delta: SLIDER_STEP,
      numberDisplayOptions: {
        decimalPlaces: 0,
        numberFormatter: strength => StringUtils.fillIn( FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty, {
          value: Utils.roundToInterval( 100 * strength / strengthRange.max, 1 )
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

    super( FaradaysElectromagneticLabStrings.strengthColonStringProperty, strengthProperty, strengthRange, options );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetStrengthControl', BarMagnetStrengthControl );