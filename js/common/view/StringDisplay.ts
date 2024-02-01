// Copyright 2023-2024, University of Colorado Boulder

//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/68 Replace with NumberDisplay or migrate to scenery-phet.

/**
 * StringDisplay displays the value of a string or TReadOnlyProperty<string> in a fixed-size display area.
 * This is a nice alternative to NumberDisplay when the thing you're displaying is not a number, or there
 * is a more complicated formatting of a number that is cleaner with a TReadOnlyProperty<string>.
 *
 * @author Chris Malley (PixelZoom, Inc.)
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

  public constructor( string: TReadOnlyProperty<string> | string, providedOptions?: StringDisplayOptions ) {

    const options = optionize<StringDisplayOptions, StrictOmit<SelfOptions, 'textOptions' | 'rectangleOptions'>, NodeOptions>()( {

      // SelfOptions
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

    const text = new RichText( string, combineOptions<RichTextOptions>( {

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

    options.children = [ background, text ];

    super( options );

    this.disposeStringDisplay = () => {
      background.dispose(); // may be listening to color Properties
      text.dispose(); // is listening to a TReadOnlyProperty<string>
    };
  }

  public override dispose(): void {
    super.dispose();
    this.disposeStringDisplay();
  }
}

faradaysElectromagneticLab.register( 'StringDisplay', StringDisplay );