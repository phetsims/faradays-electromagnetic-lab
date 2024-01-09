// Copyright 2023-2024, University of Colorado Boulder

/**
 * LoopAreaControl controls the radius of all loops in a pickup coil. The control shows values in %.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import { RichText } from '../../../../scenery/js/imports.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';

const valuePercentStringProperty = FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty;
const SLIDER_STEP = 1; // %

export default class LoopAreaControl extends NumberControl {

  public constructor( loopAreaPercentProperty: PhetioProperty<number>, loopAreaPercentRange: Range, tandem: Tandem ) {

    // Tick marks at min and max.
    const majorTicks = [
      {
        value: loopAreaPercentRange.min,
        label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
          value: loopAreaPercentRange.min
        } ), FELConstants.TICK_LABEL_OPTIONS )
      },
      {
        value: loopAreaPercentRange.max,
        label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
          value: loopAreaPercentRange.max
        } ), FELConstants.TICK_LABEL_OPTIONS )
      }
    ];

    const options = combineOptions<NumberControlOptions>( {}, FELConstants.NUMBER_CONTROL_OPTIONS, {
      isDisposable: false,
      delta: SLIDER_STEP,
      numberDisplayOptions: {
        decimalPlaces: 0,
        numberFormatter: percent => StringUtils.fillIn( valuePercentStringProperty, {
          value: percent
        } ),
        numberFormatterDependencies: [ valuePercentStringProperty ]
      },
      sliderOptions: {
        constrainValue: ( value: number ) => Utils.roundToInterval( value, SLIDER_STEP ),
        majorTicks: majorTicks,
        keyboardStep: 5,
        shiftKeyboardStep: 1,
        pageKeyboardStep: 10
      },
      tandem: tandem
    } );

    super( FaradaysElectromagneticLabStrings.loopAreaStringProperty, loopAreaPercentProperty, loopAreaPercentRange, options );

    this.addLinkedElement( loopAreaPercentProperty );
  }
}

faradaysElectromagneticLab.register( 'LoopAreaControl', LoopAreaControl );