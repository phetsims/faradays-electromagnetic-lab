// Copyright 2024, University of Colorado Boulder

/**
 * VoltageChartNode is the voltage chart that appears on the AC power supply.
 * It shows voltage (y-axis) vs time (x-axis) as a sine wave.
 *
 * This is based on VoltmeterGraphic.java and SineWaveGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import AxisLine, { AxisLineOptions } from '../../../../bamboo/js/AxisLine.js';
import TickMarkSet, { TickMarkSetOptions } from '../../../../bamboo/js/TickMarkSet.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import LinePlot from '../../../../bamboo/js/LinePlot.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
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
const NUMBER_OF_POINTS = 1000; // The larger ACPowerSupply.MAX_CYCLES is, the larger NUMBER_OF_POINTS must be to draw smooth sines.

type SelfOptions = {
  viewSize: Dimension2;
};

type VoltageChartNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem'>;

export default class VoltageChartNode extends Node {

  private readonly acPowerSupply: ACPowerSupply;

  private readonly chartTransform: ChartTransform;

  // Plot and dataSet for the wave
  private readonly wavePlot: LinePlot;
  private readonly waveDataSet: Vector2[];

  // Plot and dataSet for the cursor
  private readonly cursorPlot: LinePlot;
  private readonly cursorDataSet: Vector2[];

  public constructor( acPowerSupply: ACPowerSupply, providedOptions: VoltageChartNodeOptions ) {

    const options = optionize<VoltageChartNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    // x-axis range
    const angleRange = new Range( 0, 2 * Math.PI * ACPowerSupply.MAX_CYCLES );

    // y-axis range, with a margin above and below the largest waveform
    const yMargin = 0.05 * acPowerSupply.voltageProperty.range.getLength();
    const voltageRange = new Range( acPowerSupply.voltageProperty.range.min - yMargin, acPowerSupply.voltageProperty.range.max + yMargin );

    const chartTransform = new ChartTransform( {
      viewWidth: options.viewSize.width,
      viewHeight: options.viewSize.height,
      modelXRange: angleRange,
      modelYRange: voltageRange
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: 'black',
      stroke: null,
      cornerXRadius: 6,
      cornerYRadius: 6
    } );

    // Create a dataSet with a fixed number of points and fixed x values. We'll recompute the y values and call wavePlot.update.
    const waveDataSet: Vector2[] = [];
    const deltaAngle = angleRange.max / NUMBER_OF_POINTS;
    for ( let angle = 0; angle <= angleRange.max; angle += deltaAngle ) {
      waveDataSet.push( new Vector2( angle, 0 ) );
    }

    const wavePlot = new LinePlot( chartTransform, waveDataSet, {
      stroke: FELColors.acPowerSupplyWaveColorProperty,
      lineWidth: 1.5
    } );

    // Create a dataSet with 2 points that describe the vertical cursor line.
    const cursorDataSet = [
      new Vector2( 0, chartTransform.modelYRange.min ),
      new Vector2( 0, chartTransform.modelYRange.max )
    ];

    const cursorPlot = new LinePlot( chartTransform, cursorDataSet, {
      stroke: FELColors.acPowerSupplyCursorColorProperty,
      lineWidth: 1
    } );

    // This is a hack to make the x-axis tick marks remain static, with x=0 at the center.
    const axisTransform = new ChartTransform( {
      viewWidth: options.viewSize.width,
      viewHeight: options.viewSize.height,
      modelXRange: new Range( -10, 10 ), // unitless, arbitrary
      modelYRange: chartTransform.modelYRange // Volts
    } );

    const decorationsNode = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [

        // x & y tick marks
        new TickMarkSet( axisTransform, Orientation.HORIZONTAL, 2, TICK_MARK_SET_OPTIONS ), // unitless
        new TickMarkSet( axisTransform, Orientation.VERTICAL, 20, TICK_MARK_SET_OPTIONS ), // Volts

        // x & y axes
        new AxisLine( axisTransform, Orientation.HORIZONTAL, AXIS_LINE_OPTIONS ),
        new AxisLine( axisTransform, Orientation.VERTICAL, AXIS_LINE_OPTIONS ),

        // plots
        wavePlot,
        cursorPlot
      ]
    } );

    options.children = [ chartRectangle, decorationsNode ];

    super( options );

    this.acPowerSupply = acPowerSupply;

    this.chartTransform = chartTransform;
    this.wavePlot = wavePlot;
    this.waveDataSet = waveDataSet;
    this.cursorPlot = cursorPlot;
    this.cursorDataSet = cursorDataSet;

    acPowerSupply.maxVoltageProperty.link( maxVoltage => this.updateWave( maxVoltage ) );

    acPowerSupply.numberOfCyclesProperty.link( numberOfCycles => this.updateModelXRange( numberOfCycles ) );

    acPowerSupply.angleProperty.link( angle => this.updateCursor( angle ) );
  }

  /**
   * Updates the wave shown on the chart.
   */
  private updateWave( maxVoltage: number ): void {
    this.waveDataSet.forEach( point => point.setY( maxVoltage * Math.sin( point.x ) ) );
    this.wavePlot.update(); // Since we mutated waveDataSet, calling update is our responsibility.
  }

  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/59
  // Zero-crossing is not at the y-axis, and waveform is not symmetric about y-axis.
  /**
   * Updates the chart transform's range for the x-axis.
   */
  private updateModelXRange( numberOfCycles: number ): void {
    this.chartTransform.setModelXRange( new Range( 0, 2 * Math.PI * numberOfCycles ) );
  }

  /**
   * Moves the cursor.
   */
  private updateCursor( angle: number ): void {
    this.cursorDataSet[ 0 ].setX( angle );
    this.cursorDataSet[ 1 ].setX( angle );
    this.cursorPlot.update(); // Since we mutated cursorDataSet, calling update is our responsibility.
  }
}

faradaysElectromagneticLab.register( 'VoltageChartNode', VoltageChartNode );