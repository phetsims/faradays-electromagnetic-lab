// Copyright 2024, University of Colorado Boulder

/**
 * BatteryNode is the view of a battery.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { LinearGradient, Node, NodeOptions, NodeTranslationOptions, Rectangle, TColor } from '../../../../scenery/js/imports.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import optionize from '../../../../phet-core/js/optionize.js';

const DEFAULT_SIZE = new Dimension2( 165, 85 );

type SelfOptions = {
  size?: Dimension2; // dimensions of the battery
  stroke?: TColor; // stroke used for all elements of the battery
  lineWidth?: number; // lineWidth used for all elements of the battery
};

type BatteryNodeOptions = SelfOptions & NodeTranslationOptions & PickOptional<NodeOptions, 'scale'>;

export default class BatteryNode extends Node {

  public constructor( providedOptions?: BatteryNodeOptions ) {

    const options = optionize<BatteryNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      size: DEFAULT_SIZE,
      stroke: 'black',
      lineWidth: 1
    }, providedOptions );

    const negativeEndHeight = options.size.height;

    const negativeEndGradient = new LinearGradient( 0, 0, 0, negativeEndHeight )
      .addColorStop( 0.05, 'rgb( 102, 102, 102 )' )
      .addColorStop( 0.3, 'rgb( 173, 173, 173 )' )
      .addColorStop( 0.7, 'rgb( 40, 40, 40 )' );

    const negativeEndNode = new Rectangle( 0, 0, options.size.width, negativeEndHeight, {
      fill: negativeEndGradient,
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    const positiveEndHeight = options.size.height;

    const positiveEndGradient = new LinearGradient( 0, 0, 0, positiveEndHeight )
      .addColorStop( 0.05, 'rgb( 182, 103, 48 )' )
      .addColorStop( 0.3, 'rgb( 222, 218, 215 )' )
      .addColorStop( 0.7, 'rgb( 200, 99, 38 )' );

    const positiveEndNode = new Rectangle( 0, 0, 0.3 * options.size.width, positiveEndHeight, {
      fill: positiveEndGradient,
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      rightCenter: negativeEndNode.rightCenter
    } );

    const terminalHeight = 0.3 * options.size.height;

    const terminalGradient = new LinearGradient( 0, 0, 0, terminalHeight )
      .addColorStop( 0.05, 'rgb( 150, 150, 150 )' )
      .addColorStop( 0.3, 'rgb( 244, 244, 244 )' )
      .addColorStop( 0.7, 'rgb( 170, 170, 170 )' );

    const terminalNode = new Rectangle( 0, 0, 7, terminalHeight, {
      fill: terminalGradient,
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      left: negativeEndNode.right - options.lineWidth,
      centerY: negativeEndNode.centerY
    } );

    options.children = [ negativeEndNode, positiveEndNode, terminalNode ];

    super( options );
  }
}

faradaysElectromagneticLab.register( 'BatteryNode', BatteryNode );