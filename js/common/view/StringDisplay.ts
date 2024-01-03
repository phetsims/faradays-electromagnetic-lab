// Copyright 2023-2024, University of Colorado Boulder

//TODO migrate to scenery-phet?

/**
 * StringDisplay displays the value of a string Property in a fixed-size display area.  It is used as a substitute
 * for NumberDisplay, which has gotten too complicated and is in need of replacement.
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Node, NodeOptions, Rectangle, RectangleOptions, RichText, RichTextOptions } from '../../../../scenery/js/imports.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = {
  size: Dimension2;
  xMargin?: number;
  yMargin?: number;
  align?: 'left' | 'right';
  rectangleOptions?: RectangleOptions;
  textOptions?: StrictOmit<RichTextOptions, 'maxWidth' | 'maxHeight'>;
};

export type StringDisplayOptions = SelfOptions & NodeOptions;

export default class StringDisplay extends Node {

  private readonly disposeStringDisplay: () => void;

  public constructor( stringProperty: TReadOnlyProperty<string>, providedOptions?: StringDisplayOptions ) {

    const options = optionize<StringDisplayOptions, StrictOmit<SelfOptions, 'textOptions' | 'rectangleOptions'>, NodeOptions>()( {
      xMargin: 2,
      yMargin: 2,
      align: 'right'
    }, providedOptions );

    const background = new Rectangle( 0, 0, options.size.width, options.size.height,
      combineOptions<RectangleOptions>( {
        fill: 'white',
        stroke: 'black',
        cornerRadius: 4
      }, options.rectangleOptions ) );

    const text = new RichText( stringProperty, combineOptions<RichTextOptions>( {

      // Text is constrained to fit the background rectangle.
      maxWidth: options.size.width - ( 2 * options.xMargin ),
      maxHeight: options.size.height - ( 2 * options.yMargin )
    }, options.textOptions ) );

    // Dynamically align the text in the background.
    text.boundsProperty.link( bounds => {
      if ( options.align === 'right' ) {
        text.right = background.right - options.xMargin;
      }
      else {
        text.left = background.left + options.xMargin;
      }
      text.centerY = background.centerY;
    } );

    super( {
      children: [ background, text ]
    } );

    this.disposeStringDisplay = () => {
      background.dispose(); // may be listening to color Properties
      text.dispose();
    };
  }

  public override dispose(): void {
    super.dispose();
    this.disposeStringDisplay();
  }
}

faradaysElectromagneticLab.register( 'StringDisplay', StringDisplay );