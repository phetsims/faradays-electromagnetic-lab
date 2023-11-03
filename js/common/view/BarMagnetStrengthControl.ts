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

const SLIDER_STEP = 1;
const TICK_LABEL_OPTIONS = {
  font: FELConstants.TICK_LABEL_FONT
};

export default class BarMagnetStrengthControl extends NumberControl {

  public constructor( barMagnetStrengthProperty: NumberProperty, tandem: Tandem ) {

    //TODO This control should be %, while barMagnetStrengthProperty is gauss.
    //TODO Add tick marks at 0, 50, 100%

    const tickValues = [
      barMagnetStrengthProperty.range.min,
      barMagnetStrengthProperty.range.min + barMagnetStrengthProperty.range.getLength() / 2,
      barMagnetStrengthProperty.range.max
    ];
    const majorTicks = tickValues.map( value => {
      const stringProperty = new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valueUnitsStringProperty, {
        value: value,
        units: FaradaysElectromagneticLabStrings.units.gaussStringProperty
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
        valuePattern: new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valueUnitsStringProperty, {
          units: FaradaysElectromagneticLabStrings.units.gaussStringProperty
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

    super(
      FaradaysElectromagneticLabStrings.strengthColonStringProperty,
      barMagnetStrengthProperty,
      barMagnetStrengthProperty.range,
      options
    );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetStrengthControl', BarMagnetStrengthControl );