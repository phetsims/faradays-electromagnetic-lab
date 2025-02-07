// Copyright 2024, University of Colorado Boulder

/**
 * VoltageChartNode is the voltage chart that appears on the AC power supply.
 * It displays voltage (y-axis) vs time (x-axis) as a sine wave.
 *
 * This is based on VoltmeterGraphic.java and SineWaveGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AxisLine, { AxisLineOptions } from '../../../../bamboo/js/AxisLine.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import LinePlot from '../../../../bamboo/js/LinePlot.js';
import TickMarkSet, { TickMarkSetOptions } from '../../../../bamboo/js/TickMarkSet.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Node, { NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELColors from '../FELColors.js';
import ACPowerSupply from '../model/ACPowerSupply.js';

const AXIS_LINE_OPTIONS: AxisLineOptions = {
  stroke: FELColors.acPowerSupplyAxesColorProperty,
  lineWidth: 0.5
};
const TICK_MARK_SET_OPTIONS: TickMarkSetOptions = {
  stroke: FELColors.acPowerSupplyAxesColorProperty,
  lineWidth: 0.5,
  extent: 10
};

// The larger ACPowerSupply.MAX_CYCLES is, the larger NUMBER_OF_POINTS must be to draw a smooth waveform.
const NUMBER_OF_POINTS = 1000;

type SelfOptions = {
  viewSize: Dimension2;
};

type VoltageChartNodeOptions = SelfOptions & NodeTranslationOptions;

export default class VoltageChartNode extends Node {

  public constructor( acPowerSupply: ACPowerSupply, providedOptions: VoltageChartNodeOptions ) {

    const options = optionize<VoltageChartNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    // y-axis range, with a margin above and below the largest waveform
    const yMargin = 0.05 * acPowerSupply.voltageProperty.range.getLength();
    const voltageRange = new Range( acPowerSupply.voltageProperty.range.min - yMargin, acPowerSupply.voltageProperty.range.max + yMargin );

    const chartTransform = new ChartTransform( {
      viewWidth: options.viewSize.width,
      viewHeight: options.viewSize.height,
      modelXRange: acPowerSupply.maxAngleRange,
      modelYRange: voltageRange
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: 'black',
      stroke: null,
      cornerXRadius: 6,
      cornerYRadius: 6
    } );

    // Create a dataSet with a fixed number of points and fixed x values. We'll recompute the y values to match
    // acPowerSupply.maxVoltageProperty, and change chartTransform.modelXRange to display the relevant portion of
    // the dataSet.
    const waveDataSet: Vector2[] = [];
    const deltaAngle = acPowerSupply.maxAngleRange.max / NUMBER_OF_POINTS;
    for ( let angle = 0; angle <= acPowerSupply.maxAngleRange.max; angle += deltaAngle ) {
      waveDataSet.push( new Vector2( angle, 0 ) );
    }

    // Plots the sine wave.
    const wavePlot = new LinePlot( chartTransform, waveDataSet, {
      stroke: FELColors.acPowerSupplyWaveColorProperty,
      lineWidth: 1.5
    } );

    // Create a dataSet with 2 points that describe the cursor (vertical line) that traces the voltage over time.
    // We'll change the x values to match acPowerSupply.angleProperty.
    const cursorDataSet = [
      new Vector2( 0, chartTransform.modelYRange.min ),
      new Vector2( 0, chartTransform.modelYRange.max )
    ];

    const cursorPlot = new LinePlot( chartTransform, cursorDataSet, {
      stroke: FELColors.acPowerSupplyCursorColorProperty,
      lineWidth: 1
    } );

    // This is a bit of a hack to make the x-axis appear to be something that it is not.
    // In the model, the x-axis is actually the angle of the waveform, and its range varies based on frequency.
    // For the chart, we want the x-axis to appear to be time, with a fixed range, and origin at the center.
    const axesTransform = new ChartTransform( {
      viewWidth: options.viewSize.width,
      viewHeight: options.viewSize.height,
      modelXRange: new Range( -10, 10 ), // unitless, arbitrary range
      modelYRange: chartTransform.modelYRange // Volts
    } );

    // Parent for all chart elements that should be clipped to chartRectangle.
    const clippedNode = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [

        // x & y tick marks
        new TickMarkSet( axesTransform, Orientation.HORIZONTAL, 2, TICK_MARK_SET_OPTIONS ), // unitless
        new TickMarkSet( axesTransform, Orientation.VERTICAL, 20, TICK_MARK_SET_OPTIONS ), // Volts

        // x & y axes
        new AxisLine( axesTransform, Orientation.HORIZONTAL, AXIS_LINE_OPTIONS ),
        new AxisLine( axesTransform, Orientation.VERTICAL, AXIS_LINE_OPTIONS ),

        // plots
        wavePlot,
        cursorPlot
      ]
    } );

    options.children = [ chartRectangle, clippedNode ];

    super( options );

    acPowerSupply.maxVoltageProperty.link( maxVoltage => {
      waveDataSet.forEach( point => point.setY( maxVoltage * Math.sin( point.x ) ) );
      wavePlot.update(); // Since we mutated waveDataSet, calling update is our responsibility.
    } );

    acPowerSupply.angleProperty.link( angle => {
      cursorDataSet[ 0 ].setX( angle );
      cursorDataSet[ 1 ].setX( angle );
      cursorPlot.update(); // Since we mutated cursorDataSet, calling update is our responsibility.
    } );

    acPowerSupply.visibleAngleRangeProperty.link( range => chartTransform.setModelXRange( range ) );
  }
}

faradaysElectromagneticLab.register( 'VoltageChartNode', VoltageChartNode );