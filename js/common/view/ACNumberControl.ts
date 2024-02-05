// Copyright 2024, University of Colorado Boulder

/**
 * ACNumberControl is a specialization of NumberControl used for controlling frequency and max voltage of
 * the AC Power Supply.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import Utils from '../../../../dot/js/Utils.js';
import { HBox, Node, NodeTranslationOptions, VBox } from '../../../../scenery/js/imports.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import Slider from '../../../../sun/js/Slider.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import FELColors from '../FELColors.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const NUMBER_DISPLAY_FONT = new PhetFont( 12 );
const HORIZONTAL_TRACK_SIZE = new Dimension2( 100, 3 );
const SLIDER_STEP = 1; // %

type SelfOptions = {
  orientation: 'horizontal' | 'vertical';
};

type PercentNumberControlOptions = SelfOptions & NodeTranslationOptions & PickRequired<NumberControlOptions, 'tandem'>;

export default class ACNumberControl extends NumberControl {

  public constructor( numberProperty: NumberProperty, providedOptions: PercentNumberControlOptions ) {

    const options = optionize<PercentNumberControlOptions, SelfOptions, NumberControlOptions>()( {

      // NumberControlOptions
      includeArrowButtons: false,
      layoutFunction: ( providedOptions.orientation === 'horizontal' ) ? createHorizontalLayout : createVerticalLayout,
      titleNodeOptions: {
        tandem: Tandem.OPT_OUT
      },
      sliderOptions: {
        constrainValue: ( value: number ) => Utils.roundToInterval( value, SLIDER_STEP ),
        orientation: ( providedOptions.orientation === 'horizontal' ) ? Orientation.HORIZONTAL : Orientation.VERTICAL,
        trackSize: ( providedOptions.orientation === 'horizontal' ) ? HORIZONTAL_TRACK_SIZE : HORIZONTAL_TRACK_SIZE.swapped()
      },
      numberDisplayOptions: {
        backgroundFill: FELColors.acPowerSupplyDisplayColorProperty,
        backgroundStroke: null,
        cornerRadius: 3,
        xMargin: 8,
        yMargin: 5,
        textOptions: {
          font: NUMBER_DISPLAY_FONT,
          fill: FELColors.acPowerSupplyTextColorProperty
        },
        numberFormatter: value => StringUtils.fillIn( FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty, {
          value: Utils.toFixed( value, 0 )
        } ),
        numberFormatterDependencies: [ FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty ],
        tandem: Tandem.OPT_OUT
      }
    }, providedOptions );

    super( '', numberProperty, numberProperty.range, options );
  }
}

function createVerticalLayout( titleNode: Node, numberDisplay: NumberDisplay, slider: Slider, decrementButton: ArrowButton | null, incrementButton: ArrowButton | null ): Node {
  return new VBox( {
    children: [ numberDisplay, slider ],
    spacing: 5,
    align: 'center',
    excludeInvisibleChildrenFromBounds: false
  } );
}

function createHorizontalLayout( titleNode: Node, numberDisplay: NumberDisplay, slider: Slider, decrementButton: ArrowButton | null, incrementButton: ArrowButton | null ): Node {
  return new HBox( {
    children: [ slider, numberDisplay ],
    spacing: 5,
    align: 'center',
    excludeInvisibleChildrenFromBounds: false
  } );
}

faradaysElectromagneticLab.register( 'ACNumberControl', ACNumberControl );
