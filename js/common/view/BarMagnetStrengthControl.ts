// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnetStrengthControl is the control for magnet strength. The control shows values in %.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NumberControl, { NumberControlOptions, NumberControlSliderOptions } from '../../../../scenery-phet/js/NumberControl.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import { RichText } from '../../../../scenery/js/imports.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

const valuePercentStringProperty = FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty;
const SLIDER_STEP = 1;

export default class BarMagnetStrengthControl extends NumberControl {

  public constructor( strengthPercentProperty: PhetioProperty<number>, strengthPercentRange: Range, tandem: Tandem ) {

    assert && assert( strengthPercentRange.min === 0 );

    // Ticks at min, max, middle
    const majorTicks = [

      // 0%
      {
        value: strengthPercentRange.min,
        label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
          value: strengthPercentRange.min
        } ), FELConstants.TICK_LABEL_OPTIONS )
      },

      // 50%
      {
        value: strengthPercentRange.min + strengthPercentRange.getLength() / 2,
        label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
          value: 50
        } ), FELConstants.TICK_LABEL_OPTIONS )
      },

      // 100%
      {
        value: strengthPercentRange.max,
        label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
          value: 100
        } ), FELConstants.TICK_LABEL_OPTIONS )
      }
    ];

    const options = combineOptions<NumberControlOptions>( {}, FELConstants.NUMBER_CONTROL_OPTIONS, {
      delta: SLIDER_STEP,
      numberDisplayOptions: {
        decimalPlaces: 0,
        numberFormatter: strength => StringUtils.fillIn( FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty, {
          value: new DerivedProperty( [ strengthPercentProperty ], percent => Utils.toFixed( percent, 0 ) )
        } ),
        numberFormatterDependencies: [ FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty ]
      },
      sliderOptions: combineOptions<NumberControlSliderOptions>( {
        constrainValue: ( value: number ) => Utils.roundToInterval( value, SLIDER_STEP ),
        majorTicks: majorTicks
      }, FELConstants.PERCENT_SLIDER_OPTIONS ),
      tandem: tandem
    } );

    super( FaradaysElectromagneticLabStrings.strengthColonStringProperty, strengthPercentProperty, strengthPercentRange, options );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetStrengthControl', BarMagnetStrengthControl );