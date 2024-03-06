// Copyright 2023-2024, University of Colorado Boulder

/**
 * LoopAreaControl controls the area of all loops in a coil. The control shows values in %.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NumberControl, { NumberControlOptions, NumberControlSliderOptions } from '../../../../scenery-phet/js/NumberControl.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import { RichText } from '../../../../scenery/js/imports.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

const valuePercentStringProperty = FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty;
const ARROW_STEP = 1; // %
const SLIDER_STEP = 5; // %

export default class LoopAreaControl extends NumberControl {

  public constructor( loopAreaPercentProperty: NumberProperty, tandem: Tandem ) {

    const range = loopAreaPercentProperty.range;

    // Tick marks at min and max.
    const majorTicks = [
      {
        value: range.min,
        label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
          value: range.min
        } ), FELConstants.TICK_LABEL_OPTIONS )
      },
      {
        value: range.max,
        label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
          value: range.max
        } ), FELConstants.TICK_LABEL_OPTIONS )
      }
    ];

    const options = combineOptions<NumberControlOptions>( {}, FELConstants.NUMBER_CONTROL_OPTIONS, {
      isDisposable: false,
      delta: ARROW_STEP,
      numberDisplayOptions: {
        decimalPlaces: 0,
        numberFormatter: percent => StringUtils.fillIn( valuePercentStringProperty, {
          value: percent
        } ),
        numberFormatterDependencies: [ valuePercentStringProperty ]
      },
      sliderOptions: combineOptions<NumberControlSliderOptions>( {
        constrainValue: ( value: number ) => Utils.roundToInterval( value, SLIDER_STEP ),
        majorTicks: majorTicks
      }, FELConstants.PERCENT_SLIDER_OPTIONS ),
      tandem: tandem,
      phetioFeatured: true
    } );

    super( FaradaysElectromagneticLabStrings.loopAreaStringProperty, loopAreaPercentProperty, range, options );

    this.addLinkedElement( loopAreaPercentProperty );
  }
}

faradaysElectromagneticLab.register( 'LoopAreaControl', LoopAreaControl );