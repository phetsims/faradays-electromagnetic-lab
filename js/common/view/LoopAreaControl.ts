// Copyright 2023-2024, University of Colorado Boulder

/**
 * LoopAreaControl controls the radius of all loops in a pickup coil. The control shows values in %.
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
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import { RichText } from '../../../../scenery/js/imports.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MappedProperty from '../../../../axon/js/MappedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

const valuePercentStringProperty = FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty;
const SLIDER_STEP = 1; // %

export default class LoopAreaControl extends NumberControl {

  public constructor( loopAreaProperty: NumberProperty, tandem: Tandem ) {

    const loopAreaRange = loopAreaProperty.rangeProperty.value;

    const minPercent = Utils.roundToInterval( 100 * loopAreaRange.min / loopAreaRange.max, 1 );
    const maxPercent = 100;
    const percentRange = new Range( minPercent, maxPercent );

    const loopAreaPercentProperty = new MappedProperty<number, number>( loopAreaProperty, {
      bidirectional: true,
      map: ( loopArea: number ) => 100 * loopArea / loopAreaRange.max,
      inverseMap: ( percent: number ) => percent * loopAreaRange.max / 100,
      tandem: tandem.createTandem( 'loopAreaPercentProperty' ),
      phetioValueType: NumberIO,
      phetioReadOnly: true // use loopAreaProperty
    } );

    const majorTicks = [

      // 20%
      {
        value: minPercent,
        label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
          value: minPercent
        } ), FELConstants.TICK_LABEL_OPTIONS )
      },

      // 100%
      {
        value: maxPercent,
        label: new RichText( new PatternStringProperty( valuePercentStringProperty, {
          value: maxPercent
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

    super( FaradaysElectromagneticLabStrings.loopAreaStringProperty, loopAreaPercentProperty, percentRange, options );

    this.addLinkedElement( loopAreaProperty );
  }
}

faradaysElectromagneticLab.register( 'LoopAreaControl', LoopAreaControl );