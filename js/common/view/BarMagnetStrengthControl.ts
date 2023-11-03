// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetStrengthControl is the control for magnet strength.
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

export default class BarMagnetStrengthControl extends NumberControl {

  public constructor( barMagnetStrengthProperty: NumberProperty, tandem: Tandem ) {

    assert && assert( barMagnetStrengthProperty.range.min === 0 );

    // barMagnetStrengthProperty is in gauss, while this control is in %.
    const percentProperty = new MappedProperty<number, number>( barMagnetStrengthProperty, {
      phetioValueType: NumberIO,
      reentrant: true,
      bidirectional: true,

      // gauss => %
      map: ( strength: number ) => 100 * strength / barMagnetStrengthProperty.range.max,

      // % => gauss
      inverseMap: ( percent: number ) => ( percent / 100 ) * barMagnetStrengthProperty.range.max
    } );

    const tickValues = [ 0, 50, 100 ];
    const majorTicks = tickValues.map( value => {
      const stringProperty = new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty, {
        value: value
      } );

      return {
        value: value,
        label: new RichText( stringProperty, TICK_LABEL_OPTIONS )
      };
    } );

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
      FaradaysElectromagneticLabStrings.strengthColonStringProperty,
      percentProperty,
      new Range( 0, 100 ),
      options
    );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetStrengthControl', BarMagnetStrengthControl );