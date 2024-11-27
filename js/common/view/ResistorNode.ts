// Copyright 2023-2024, University of Colorado Boulder

/**
 * ResistorNode is a 4-band resistor, which has 3 value bands and 1 tolerance band.
 *
 * For general information on color coding of resistors, see (for example)
 * https://www.utmel.com/tools/band-resistor-color-code-calculator?id=20
 *
 * For details on design history and choice of colors for this resistor, see
 * https://github.com/phetsims/faradays-electromagnetic-lab/issues/29.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { HBox, Line, Node, NodeOptions, NodeTranslationOptions, Rectangle, TPaint } from '../../../../scenery/js/imports.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

type SelfOptions = {
  size: Dimension2;
  xMargin?: number; // margin on left and right ends of the resistor
  bodyFill?: TPaint;
  bodyStroke?: TPaint;
  bodyLineWidth?: number;
  bodyCornerRadius?: number;
  bandLineWidth?: number; // width of all bands
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
      bandLineWidth: 3,
      bandSpacing: 3
    }, providedOptions );

    assert && assert( options.valueBandColors.length === 3, 'A 4-band resistor must have 3 value bands' );

    // The main body of the resistor
    const bodyNode = new Rectangle( 0, 0, options.size.width, options.size.height, {
      fill: options.bodyFill,
      stroke: options.bodyStroke,
      lineWidth: options.bodyLineWidth,
      cornerRadius: options.bodyCornerRadius
    } );

    // Prevent bands from bleeding into bodyNode stroke.
    const bandLength = options.size.height - options.bodyLineWidth;
    const bandTop = bodyNode.top + options.bodyLineWidth;

    // Value bands appear on the left end of the resistor.
    const valueBands = new HBox( {
      spacing: options.bandSpacing,
      children: options.valueBandColors.map(
        ( bandColor, index ) => new Line( 0, 0, 0, bandLength, {
          stroke: bandColor,
          lineWidth: options.bandLineWidth
        } ) ),
      left: bodyNode.left + options.xMargin,
      top: bandTop
    } );

    // The tolerance bands appears on the right end of the resistor.
    const toleranceBand = new Line( 0, 0, 0, bandLength, {
      stroke: options.toleranceBandColor,
      lineWidth: options.bandLineWidth,
      centerX: bodyNode.right - options.xMargin,
      top: bandTop
    } );

    options.children = [ bodyNode, valueBands, toleranceBand ];

    super( options );
  }
}

faradaysElectromagneticLab.register( 'ResistorNode', ResistorNode );