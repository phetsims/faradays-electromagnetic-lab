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
  bodyFill?: TPaint;
  bodyStroke?: TPaint;
  bodyLineWidth?: number;
  bandWidth?: number;
  bandMargin?: number; // margin on left and right ends of the resistor
  bandSpacing?: number; // space between adjacent bands
  band1Color: TPaint;
  band2Color: TPaint;
  band3Color: TPaint;
  band4Color: TPaint;
};

type ResistorNodeOptions = SelfOptions & NodeTranslationOptions & PickOptional<NodeOptions, 'tandem'>;

export default class ResistorNode extends Node {

  public constructor( providedOptions: ResistorNodeOptions ) {

    const options = optionize<ResistorNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      bodyFill: 'rgb( 200, 176, 135 )',
      bodyStroke: 'black',
      bodyLineWidth: 1,
      bandWidth: 3,
      bandMargin: 10,
      bandSpacing: 4
    }, providedOptions );

    const bodyNode = new Rectangle( 0, 0, options.size.width, options.size.height,
      combineOptions<RectangleOptions>( {
        fill: options.bodyFill,
        stroke: options.bodyStroke,
        lineWidth: options.bodyLineWidth,
        cornerRadius: 5
      }, providedOptions ) );

    const bandLength = options.size.height - options.bodyLineWidth;
    const bandTop = bodyNode.top + options.bodyLineWidth;

    // value (x 1)
    const band1 = new Line( 0, 0, 0, bandLength, {
      stroke: options.band1Color,
      lineWidth: options.bandWidth,
      centerX: bodyNode.left + options.bandMargin,
      top: bandTop
    } );

    // value (x 10)
    const band2 = new Line( 0, 0, 0, bandLength, {
      stroke: options.band2Color,
      lineWidth: options.bandWidth,
      centerX: band1.right + options.bandSpacing,
      top: bandTop
    } );

    // value (x 100)
    const band3 = new Line( 0, 0, 0, bandLength, {
      stroke: options.band3Color,
      lineWidth: options.bandWidth,
      centerX: band2.right + options.bandSpacing,
      top: bandTop
    } );

    // tolerance (+/- %)
    const band4 = new Line( 0, 0, 0, bandLength, {
      stroke: options.band4Color,
      lineWidth: options.bandWidth,
      centerX: bodyNode.right - options.bandMargin,
      top: bandTop
    } );

    options.children = [ bodyNode, band1, band2, band3, band4 ];

    super( options );
  }
}

faradaysElectromagneticLab.register( 'ResistorNode', ResistorNode );