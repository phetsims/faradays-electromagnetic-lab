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

  // Fixed size of the background
  size: Dimension2;

  // Margins inside the background
  xMargin?: number;
  yMargin?: number;

  // How the string is aligned in the background
  alignX?: 'left' | 'right' | 'center';
  alignY?: 'top' | 'bottom' | 'center';

  // Options passed to the background Rectangle
  rectangleOptions?: RectangleOptions;

  // Options passed to the RichText that displays the string
  richTextOptions?: StrictOmit<RichTextOptions, 'maxWidth' | 'maxHeight'>;
};

export type StringDisplayOptions = SelfOptions & NodeOptions;

export default class StringDisplay extends Node {

  private readonly disposeStringDisplay: () => void;

  public constructor( string: TReadOnlyProperty<string> | string, providedOptions?: StringDisplayOptions ) {

    const options = optionize<StringDisplayOptions, StrictOmit<SelfOptions, 'richTextOptions' | 'rectangleOptions'>, NodeOptions>()( {

      // SelfOptions
      xMargin: 2,
      yMargin: 2,
      alignX: 'right',
      alignY: 'center'
    }, providedOptions );

    const background = new Rectangle( 0, 0, options.size.width, options.size.height,
      combineOptions<RectangleOptions>( {
        fill: 'white',
        stroke: 'black',
        cornerRadius: 4
      }, options.rectangleOptions ) );

    const text = new RichText( string, combineOptions<RichTextOptions>( {

      // Text will be scaled down if it does not fit in the background.
      maxWidth: options.size.width - ( 2 * options.xMargin ),
      maxHeight: options.size.height - ( 2 * options.yMargin )
    }, options.richTextOptions ) );

    // Dynamically align the text in the background.
    text.boundsProperty.link( bounds => {

      // x align
      if ( options.alignX === 'right' ) {
        text.right = background.right - options.xMargin;
      }
      else if ( options.alignX === 'left' ) {
        text.left = background.left + options.xMargin;
      }
      else {
        text.centerX = background.centerX;
      }

      // y align
      if ( options.alignY === 'top' ) {
        text.top = background.top + options.yMargin;
      }
      else if ( options.alignY === 'bottom' ) {
        text.bottom = background.bottom - options.yMargin;
      }
      else {
        text.centerY = background.centerY;
      }
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