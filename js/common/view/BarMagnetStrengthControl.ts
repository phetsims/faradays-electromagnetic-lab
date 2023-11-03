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

const SLIDER_STEP = 1;

export default class BarMagnetStrengthControl extends NumberControl {

  public constructor( barMagnetStrengthProperty: NumberProperty, tandem: Tandem ) {

    //TODO This control should be %, while barMagnetStrengthProperty is gauss.
    //TODO NumberDisplay resizes as value changes
    //TODO Add tick marks at 0, 50, 100%

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
        pageKeyboardStep: 10
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