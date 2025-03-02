// Copyright 2024-2025, University of Colorado Boulder

/**
 * ACNumberControl is a specialization of NumberControl used for controlling frequency and maximum voltage of
 * the AC Power Supply.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl, { NumberControlOptions, NumberControlSliderOptions } from '../../../../scenery-phet/js/NumberControl.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';
import Slider from '../../../../sun/js/Slider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELConstants from '../FELConstants.js';

const NUMBER_DISPLAY_FONT = new PhetFont( 12 );
const HORIZONTAL_THUMB_SIZE = new Dimension2( 12, 24 );
const VERTICAL_THUMB_SIZE = new Dimension2( 12, 24 ).swapped();
const HORIZONTAL_TRACK_SIZE = new Dimension2( 110, 3 );
const VERTICAL_TRACK_SIZE = new Dimension2( 3, 70 );
const SLIDER_STEP = 1; // %

type SelfOptions = {
  orientation: Orientation;
};

type PercentNumberControlOptions = SelfOptions & PickRequired<NumberControlOptions, 'tandem'>;

export default class ACNumberControl extends NumberControl {

  public constructor( numberProperty: NumberProperty, providedOptions: PercentNumberControlOptions ) {

    const options = optionize<PercentNumberControlOptions, SelfOptions, NumberControlOptions>()( {

      // NumberControlOptions
      includeArrowButtons: false,
      layoutFunction: ( providedOptions.orientation === Orientation.HORIZONTAL ) ? createHorizontalLayout : createVerticalLayout,
      titleNodeOptions: {
        tandem: Tandem.OPT_OUT
      },
      sliderOptions: combineOptions<NumberControlSliderOptions>( {}, FELConstants.PERCENT_SLIDER_OPTIONS, {
        constrainValue: ( value: number ) => Utils.roundToInterval( value, SLIDER_STEP ),
        orientation: providedOptions.orientation,
        thumbSize: ( providedOptions.orientation === Orientation.HORIZONTAL ) ? HORIZONTAL_THUMB_SIZE : VERTICAL_THUMB_SIZE,
        trackSize: ( providedOptions.orientation === Orientation.HORIZONTAL ) ? HORIZONTAL_TRACK_SIZE : VERTICAL_TRACK_SIZE,
        tandem: Tandem.OPT_OUT
      } ),
      numberDisplayOptions: {
        xMargin: 6,
        yMargin: 3,
        textOptions: {
          font: NUMBER_DISPLAY_FONT,
          maxWidth: 30
        },
        numberFormatter: value => StringUtils.fillIn( FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty, {
          value: Utils.toFixed( value, 0 )
        } ),
        numberFormatterDependencies: [ FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty ],
        tandem: Tandem.OPT_OUT
      }
    }, providedOptions );

    super( '', numberProperty, numberProperty.range, options );

    this.addLinkedElement( numberProperty );
  }
}

function createVerticalLayout( titleNode: Node, numberDisplay: NumberDisplay, slider: Slider, decrementButton: ArrowButton | null, incrementButton: ArrowButton | null ): Node {
  return new VBox( {
    children: [ numberDisplay, slider ],
    spacing: 3,
    align: 'center',
    excludeInvisibleChildrenFromBounds: false
  } );
}

function createHorizontalLayout( titleNode: Node, numberDisplay: NumberDisplay, slider: Slider, decrementButton: ArrowButton | null, incrementButton: ArrowButton | null ): Node {
  return new HBox( {
    children: [ slider, numberDisplay ],
    spacing: 3,
    align: 'center',
    excludeInvisibleChildrenFromBounds: false
  } );
}

faradaysElectromagneticLab.register( 'ACNumberControl', ACNumberControl );