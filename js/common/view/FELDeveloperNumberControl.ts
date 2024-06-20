// Copyright 2024, University of Colorado Boulder

/**
 * FELDeveloperNumberControl is the number control used in FELDeveloperAccordionBox.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberControl, { LayoutFunction } from '../../../../scenery-phet/js/NumberControl.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import { HBox, Node, RichText, VBox } from '../../../../scenery/js/imports.js';
import ResetButton from '../../../../scenery-phet/js/buttons/ResetButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

const CONTROL_FONT = new PhetFont( 12 );
const TICK_TEXT_OPTIONS = {
  font: new PhetFont( 10 )
};
const TRACK_SIZE = new Dimension2( 140, 1 );
const THUMB_SIZE = new Dimension2( 10, 20 );

export class FELDeveloperNumberControl extends NumberControl {

  public constructor( labelString: string, numberProperty: NumberProperty, decimalPlaces: number, useCommaSeparator = false ) {

    const range = numberProperty.range;

    const min = useCommaSeparator ?
                Utils.toFixedNumber( range.min, decimalPlaces ).toLocaleString() :
                Utils.toFixed( range.min, decimalPlaces );
    const max = useCommaSeparator ?
                Utils.toFixedNumber( range.max, decimalPlaces ).toLocaleString() :
                Utils.toFixed( range.max, decimalPlaces );

    // Tick marks at the extremes of the range
    const majorTicks = [
      {
        value: range.min,
        label: new RichText( min, TICK_TEXT_OPTIONS )
      },
      {
        value: range.max,
        label: new RichText( max, TICK_TEXT_OPTIONS )
      }
    ];

    // Since Properties related to developer controls are not affected by Reset All, add a reset button.
    const resetButton = new ResetButton( {
      listener: () => numberProperty.reset(),
      scale: 0.4,
      tandem: Tandem.OPT_OUT
    } );

    const sliderStep = Utils.toFixedNumber( Math.pow( 10, -decimalPlaces ), decimalPlaces );

    super( labelString, numberProperty, range, {
      delta: sliderStep,
      layoutFunction: createLayoutFunction( resetButton ),
      titleNodeOptions: {
        font: CONTROL_FONT
      },
      sliderOptions: {
        soundGenerator: null,
        constrainValue: value => Utils.roundToInterval( value, sliderStep ),
        majorTicks: majorTicks,
        trackSize: TRACK_SIZE,
        trackFillEnabled: 'black',
        trackStroke: null,
        thumbSize: THUMB_SIZE,
        thumbTouchAreaXDilation: 5,
        thumbTouchAreaYDilation: 5,
        majorTickLength: 10,
        layoutOptions: {
          grow: 1
        }
      },
      numberDisplayOptions: {
        numberFormatter: value => useCommaSeparator ?
                                  Utils.toFixedNumber( value, decimalPlaces ).toLocaleString() :
                                  Utils.toFixed( value, decimalPlaces ),
        maxWidth: 100,
        textOptions: {
          font: CONTROL_FONT
        }
      },
      tandem: Tandem.OPT_OUT
    } );
  }
}

/**
 * Creates a NumberControl layout function that includes a reset button.
 */
function createLayoutFunction( resetButton: Node ): LayoutFunction {

  return ( titleNode, numberDisplay, slider, decrementButton, incrementButton ) => {
    assert && assert( decrementButton, 'decrementButton is required' );
    assert && assert( incrementButton, 'incrementButton is required' );

    return new VBox( {
      align: 'left',
      spacing: 4,
      children: [
        new HBox( {
          spacing: 5,
          children: [ titleNode, numberDisplay, resetButton ]
        } ),
        new HBox( {
          layoutOptions: {
            stretch: true
          },
          spacing: 4,
          children: [ decrementButton!, slider, incrementButton! ]
        } )
      ]
    } );
  };
}

faradaysElectromagneticLab.register( 'FELDeveloperNumberControl', FELDeveloperNumberControl );