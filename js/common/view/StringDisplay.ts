// Copyright 2023, University of Colorado Boulder

//TODO migrate to scenery-phet?

/**
 * TODO
 * NumberDisplay has gotten way too complicated, and does not deal with dynamic strings well. Since they do not
 * be instrumented in this sim, roll our own lighter-weight implementation that works well with dynamic strings.
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
  }
}

faradaysElectromagneticLab.register( 'StringDisplay', StringDisplay );