// Copyright 2023-2025, University of Colorado Boulder

/**
 * CompassNeedleNode is a compass needle, used in the compass and B-field visualization. It has no associated model
 * element. In its default orientation (rotation === 0), the north point of the needle points down the +x-axis.
 * The origin is at the center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELColors from '../FELColors.js';

const NEEDLE_ASPECT_RATIO = 25 / 7; // length:waist

type SelfOptions = {

  // Length (tip to tip) of the needle. The other dimension is computed to provide a consistent aspect ratio.
  length?: number;

  stroke?: TColor;
  northFill?: TColor;
  southFill?: TColor;
};

type CompassNeedleNodeOptions = SelfOptions & PickOptional<NodeOptions, 'scale'>;

export default class CompassNeedleNode extends Node {

  public constructor( providedOptions?: CompassNeedleNodeOptions ) {

    const options = optionize<CompassNeedleNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      length: 25,
      stroke: FELColors.compassNeedleStrokeProperty,
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
      stroke: options.stroke,
      lineWidth: 0.5
    } );

    options.children = [ southPath, northPath, unionPath ];

    super( options );
  }
}

faradaysElectromagneticLab.register( 'CompassNeedleNode', CompassNeedleNode );