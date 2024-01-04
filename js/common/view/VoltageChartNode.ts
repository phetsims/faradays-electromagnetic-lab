// Copyright 2023-2024, University of Colorado Boulder

/**
 * VoltageChartNode is the voltage chart that appears on the AC power supply. It shows voltage over time as a sine wave.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Color, Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import AxisLine, { AxisLineOptions } from '../../../../bamboo/js/AxisLine.js';
import TickMarkSet, { TickMarkSetOptions } from '../../../../bamboo/js/TickMarkSet.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

const AXIS_LINE_OPTIONS: AxisLineOptions = {
  stroke: Color.grayColor( 200 ), //TODO color profile
  lineWidth: 0.5
};
const TICK_MARK_SET_OPTIONS: TickMarkSetOptions = {
  stroke: Color.grayColor( 200 ), //TODO color profile
  lineWidth: 0.5,
  extent: 10
};
const X_AXIS_TICK_SPACING = 10;
const Y_AXIS_TICK_SPACING = 10;

type SelfOptions = EmptySelfOptions;

type VoltageChartNodeOptions = SelfOptions & NodeTranslationOptions;

export default class VoltageChartNode extends Node {

  public constructor( frequencyProperty: TReadOnlyProperty<number>, frequencyRange: Range,
                      maxVoltageProperty: NumberProperty, voltageRange: Range,
                      providedOptions?: VoltageChartNodeOptions ) {

    const chartTransform = new ChartTransform( {
      viewWidth: 156,
      viewHeight: 122,
      modelXRange: frequencyRange,
      modelYRange: voltageRange
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: 'black',
      stroke: null,
      cornerXRadius: 6,
      cornerYRadius: 6
    } );

    const decorationsNode = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [

        // x & y tick marks
        new TickMarkSet( chartTransform, Orientation.HORIZONTAL, frequencyRange.getLength() / X_AXIS_TICK_SPACING, TICK_MARK_SET_OPTIONS ),
        new TickMarkSet( chartTransform, Orientation.VERTICAL, voltageRange.getLength() / Y_AXIS_TICK_SPACING, TICK_MARK_SET_OPTIONS ),

        // x & y axes
        new AxisLine( chartTransform, Orientation.HORIZONTAL, AXIS_LINE_OPTIONS ),
        new AxisLine( chartTransform, Orientation.VERTICAL, AXIS_LINE_OPTIONS )
      ]
    } );

    const options = optionize<VoltageChartNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      children: [ chartRectangle, decorationsNode ]
    }, providedOptions );

    super( options );
  }
}

faradaysElectromagneticLab.register( 'VoltageChartNode', VoltageChartNode );