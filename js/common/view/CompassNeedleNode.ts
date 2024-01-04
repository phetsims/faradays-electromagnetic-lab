// Copyright 2023-2024, University of Colorado Boulder

/**
 * CompassNeedleNode is a compass needle, used in the compass and B-field visualization. It has no associated model
 * element. In its default orientation (rotation === 0), the north point of the needle points down the +x-axis.
 * The origin is at the geometric center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Shape } from '../../../../kite/js/imports.js';
import FELColors from '../FELColors.js';
import { Node, Path, TColor } from '../../../../scenery/js/imports.js';
import FELQueryParameters from '../FELQueryParameters.js';
import optionize from '../../../../phet-core/js/optionize.js';

const NEEDLE_ASPECT_RATIO = 25 / 7; // length:waist

type SelfOptions = {
  length?: number;
  stroke?: TColor;
  northFill?: TColor;
  southFill?: TColor;
};

type CompassNeedleNodeOptions = SelfOptions;

export default class CompassNeedleNode extends Node {

  public constructor( providedOptions?: CompassNeedleNodeOptions ) {

    const options = optionize<CompassNeedleNodeOptions, SelfOptions>()( {

      // SelfOptions
      length: FELQueryParameters.needleLength,
      stroke: null,
      northFill: FELColors.compassNeedleNorthColorProperty,
      southFill: FELColors.compassNeedleSouthColorProperty
    }, providedOptions );

    const w = options.length;
    const h = options.length / NEEDLE_ASPECT_RATIO;

    // Start at the right (north) tip and proceed clockwise.
    const southShape = new Shape().moveTo( 0, h / 2 ).lineTo( w / 2, 0 ).lineTo( w / 2, h ).close();

    // Start at the left (south) tip and proceed clockwise.
    const northShape = new Shape().moveTo( w, h / 2 ).lineTo( w / 2, h ).lineTo( w / 2, 0 ).close();

    const southPath = new Path( southShape, {
      fill: options.southFill
    } );

    const northPath = new Path( northShape, {
      fill: options.northFill,
      left: southPath.right,
      centerY: southPath.centerY
    } );

    const unionPath = new Path( southShape.shapeUnion( northShape ), {
      stroke: options.stroke
    } );

    super( {
      children: [ southPath, northPath, unionPath ]
    } );
  }
}

faradaysElectromagneticLab.register( 'CompassNeedleNode', CompassNeedleNode );