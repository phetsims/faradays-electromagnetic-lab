// Copyright 2023, University of Colorado Boulder

/**
 * ResistorNode is a 4-band resistor. For details on color coding of resistors, see for example
 * https://www.utmel.com/tools/band-resistor-color-code-calculator?id=20
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import { HBox, Line, Node, NodeOptions, NodeTranslationOptions, Rectangle, RectangleOptions, TPaint } from '../../../../scenery/js/imports.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

type SelfOptions = {
  size: Dimension2;
  xMargin?: number; // margin on left and right ends of the resistor
  bodyFill?: TPaint;
  bodyStroke?: TPaint;
  bodyLineWidth?: number;
  bodyCornerRadius?: number;
  bandWidth?: number;
  bandSpacing?: number; // space between value bands
  valueBandColors: TPaint[]; // colors for the 3 values bands (x 1, x 10, x 100)
  toleranceBandColor: TPaint; // color for the tolerance band (+/- %)
};

type ResistorNodeOptions = SelfOptions & NodeTranslationOptions & PickOptional<NodeOptions, 'tandem'>;

export default class ResistorNode extends Node {

  public constructor( providedOptions: ResistorNodeOptions ) {

    const options = optionize<ResistorNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      xMargin: 10,
      bodyFill: 'rgb( 200, 176, 135 )',
      bodyStroke: 'black',
      bodyLineWidth: 1,
      bodyCornerRadius: 5,
      bandWidth: 3,
      bandSpacing: 3
    }, providedOptions );

    assert && assert( options.valueBandColors.length === 3, 'A 4-band resistor must have 3 value bands' );

    const bodyNode = new Rectangle( 0, 0, options.size.width, options.size.height,
      combineOptions<RectangleOptions>( {
        fill: options.bodyFill,
        stroke: options.bodyStroke,
        lineWidth: options.bodyLineWidth,
        cornerRadius: options.bodyCornerRadius
      }, providedOptions ) );

    const bandLength = options.size.height - options.bodyLineWidth;
    const bandTop = bodyNode.top + options.bodyLineWidth;

    const valueBands = new HBox( {
      spacing: options.bandSpacing,
      children: options.valueBandColors.map(
        ( bandColor, index ) => new Line( 0, 0, 0, bandLength, {
          stroke: bandColor,
          lineWidth: options.bandWidth
        } ) ),
      left: bodyNode.left + options.xMargin,
      top: bandTop
    } );

    const toleranceBand = new Line( 0, 0, 0, bandLength, {
      stroke: options.toleranceBandColor,
      lineWidth: options.bandWidth,
      centerX: bodyNode.right - options.xMargin,
      top: bandTop
    } );

    options.children = [ bodyNode, valueBands, toleranceBand ];

    super( options );
  }
}

faradaysElectromagneticLab.register( 'ResistorNode', ResistorNode );