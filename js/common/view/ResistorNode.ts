// Copyright 2023, University of Colorado Boulder

/**
 * ResistorNode is a 4-band resistor. For details on color coding of resistors, see for example
 * https://www.utmel.com/tools/band-resistor-color-code-calculator?id=20
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Line, Node, NodeOptions, NodeTranslationOptions, Rectangle, RectangleOptions, TPaint } from '../../../../scenery/js/imports.js';
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
  bandSpacing?: number; // space between adjacent bands
  valueBandColors: TPaint[];
  toleranceBandColor: TPaint;
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
      bandSpacing: 6
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

    const valueBands = options.valueBandColors.map(
      ( bandColor, index ) => new Line( 0, 0, 0, bandLength, {
        stroke: bandColor,
        lineWidth: options.bandWidth,
        centerX: bodyNode.left + options.xMargin + ( index * options.bandSpacing ),
        top: bandTop
      } ) );

    const toleranceBand = new Line( 0, 0, 0, bandLength, {
      stroke: options.toleranceBandColor,
      lineWidth: options.bandWidth,
      centerX: bodyNode.right - options.xMargin,
      top: bandTop
    } );

    options.children = [ bodyNode, ...valueBands, toleranceBand ];

    super( options );
  }
}

faradaysElectromagneticLab.register( 'ResistorNode', ResistorNode );