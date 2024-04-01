// Copyright 2024, University of Colorado Boulder

/**
 * ElectronNode is the visual representation of an electron: a circle with a minus sign.
 *
 * In the Java version, this was a shaded sphere - see ElectronGraphic.java. It was changed to address confusion about
 * the direction of current flow (electron current vs conventional current).
 * See https://github.com/phetsims/faradays-electromagnetic-lab/issues/136
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Circle, Node, NodeOptions, TColor } from '../../../../scenery/js/imports.js';
import MinusNode from '../../../../scenery-phet/js/MinusNode.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import FELColors from '../FELColors.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  color?: TColor;
  minusColor?: TColor;
};

type ElectronNodeOptions = SelfOptions & PickOptional<NodeOptions, 'scale'>;

export default class ElectronNode extends Node {

  public static readonly DIAMETER = 9;

  public constructor( providedOptions?: ElectronNodeOptions ) {

    const options = optionize<ElectronNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      color: FELColors.electronColorProperty,
      minusColor: FELColors.electronMinusColorProperty
    }, providedOptions );

    const circle = new Circle( {
      radius: ElectronNode.DIAMETER / 2,
      fill: options.color
    } );

    const minusNode = new MinusNode( {
      size: new Dimension2( 0.65 * ElectronNode.DIAMETER, 0.15 * ElectronNode.DIAMETER ),
      center: circle.center,
      fill: options.minusColor
    } );

    options.children = [ circle, minusNode ];

    super( options );
  }

  /**
   * Creates an icon.
   */
  public static createIcon( scale = 1 ): Node {
    return new ElectronNode( {
      scale: scale
    } );
  }
}

faradaysElectromagneticLab.register( 'ElectronNode', ElectronNode );