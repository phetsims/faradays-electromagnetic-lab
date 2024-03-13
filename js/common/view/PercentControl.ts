// Copyright 2024, University of Colorado Boulder

/**
 * PercentControl is a NumberControl that shows its value in % units. It's not at all general, and exists to address
 * the needs of BarMagnetStrengthControl and LoopAreaControl.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NumberControl, { NumberControlOptions, NumberControlSliderOptions } from '../../../../scenery-phet/js/NumberControl.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import { combineOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import { RichText } from '../../../../scenery/js/imports.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

const valuePercentStringProperty = FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty;
const ARROW_STEP = 1; // %
const SLIDER_STEP = 5; // %

type SelfOptions = {
  arrowStep?: number; // %
  sliderStep?: number; // %
  hasCenterTickMark: boolean;
};

export type PercentControlOptions = SelfOptions & PickRequired<NumberControlOptions, 'tandem'>;

export default class PercentControl extends NumberControl {

  protected constructor( titleStringProperty: TReadOnlyProperty<string>, numberProperty: NumberProperty, providedOptions: PercentControlOptions ) {

    const range = numberProperty.range;

    const majorTicks = [];

    // Tick mark at min.
    majorTicks.push( {
      value: range.min,
      label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
        value: range.min
      } ), FELConstants.TICK_LABEL_OPTIONS )
    } );

    // Optional tick mark at center.
    if ( providedOptions.hasCenterTickMark ) {
      majorTicks.push( {
        value: range.min + range.getLength() / 2,
        label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
          value: range.getLength() / 2
        } ), FELConstants.TICK_LABEL_OPTIONS )
      } );
    }

    // Tick mark at max.
    majorTicks.push( {
      value: range.max,
      label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
        value: range.max
      } ), FELConstants.TICK_LABEL_OPTIONS )
    } );

    const options = optionize4<PercentControlOptions, SelfOptions, NumberControlOptions>()( {}, FELConstants.NUMBER_CONTROL_OPTIONS, {

      // SelfOptions
      arrowStep: 1,
      sliderStep: 5,

      // NumberControlOptions
      isDisposable: false,
      delta: ARROW_STEP,
      numberDisplayOptions: {
        decimalPlaces: 0,
        numberFormatter: percent => StringUtils.fillIn( valuePercentStringProperty, {
          value: percent
        } ),
        numberFormatterDependencies: [ valuePercentStringProperty ]
      },
      sliderOptions: combineOptions<NumberControlSliderOptions>( {}, FELConstants.PERCENT_SLIDER_OPTIONS, {
        constrainValue: ( value: number ) => Utils.roundToInterval( value, SLIDER_STEP ),
        majorTicks: majorTicks
      } ),
      phetioFeatured: true
    }, providedOptions );

    super( titleStringProperty, numberProperty, range, options );

    this.addLinkedElement( numberProperty );
  }
}

faradaysElectromagneticLab.register( 'PercentControl', PercentControl );