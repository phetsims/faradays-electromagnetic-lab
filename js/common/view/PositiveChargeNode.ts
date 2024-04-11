// Copyright 2024, University of Colorado Boulder

/**
 * PositiveChargeNode is the visual representation of an imaginary positive charge: a circle with a plus sign.
 * It is used to represent conventional current flow.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Circle, Node, NodeOptions, TColor } from '../../../../scenery/js/imports.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import FELColors from '../FELColors.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';

type SelfOptions = {
  color?: TColor;
  plusColor?: TColor;
};

type PositiveChargeNodeOptions = SelfOptions & PickOptional<NodeOptions, 'scale'>;

export default class PositiveChargeNode extends Node {

  public static readonly DIAMETER = 9;

  public constructor( providedOptions?: PositiveChargeNodeOptions ) {

    const options = optionize<PositiveChargeNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      color: FELColors.positiveChargeColorProperty,
      plusColor: FELColors.positiveChargePlusColorProperty
    }, providedOptions );

    const circle = new Circle( {
      radius: PositiveChargeNode.DIAMETER / 2,
      fill: options.color
    } );

    const minusNode = new PlusNode( {
      size: new Dimension2( 0.65 * PositiveChargeNode.DIAMETER, 0.15 * PositiveChargeNode.DIAMETER ),
      center: circle.center,
      fill: options.plusColor
    } );

    options.children = [ circle, minusNode ];

    super( options );
  }

  /**
   * Creates an icon.
   */
  public static createIcon( scale = 1 ): Node {
    return new PositiveChargeNode( {
      scale: scale
    } );
  }
}

faradaysElectromagneticLab.register( 'PositiveChargeNode', PositiveChargeNode );