// Copyright 2024, University of Colorado Boulder

/**
 * VoltageChartNode is the voltage chart that appears on the AC power supply.
 * It shows voltage (y-axis) vs time (x-axis) as a sine wave.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import AxisLine, { AxisLineOptions } from '../../../../bamboo/js/AxisLine.js';
import TickMarkSet, { TickMarkSetOptions } from '../../../../bamboo/js/TickMarkSet.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import LinePlot from '../../../../bamboo/js/LinePlot.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import FELColors from '../FELColors.js';
import ACPowerSupply from '../model/ACPowerSupply.js';
import Utils from '../../../../dot/js/Utils.js';

const AXIS_LINE_OPTIONS: AxisLineOptions = {
  stroke: FELColors.acPowerSupplyAxesColorProperty,
  lineWidth: 0.5
};
const TICK_MARK_SET_OPTIONS: TickMarkSetOptions = {
  stroke: FELColors.acPowerSupplyAxesColorProperty,
  lineWidth: 0.5,
  extent: 10
};
const VIEW_SIZE = new Dimension2( 156, 122 );
const X_AXIS_TICK_SPACING = 10;
const Y_AXIS_TICK_SPACING = 10;
const MAX_CYCLES = 10; //TODO This was 20, frequencyRange.max / frequencyRange.min, in the Java version
const NUMBER_OF_POINTS = 1000; // The larger MAX_CYCLES is, the larger NUMBER_OF_POINTS must be to draw smooth sines.
const PHASE_ANGLE = Math.PI; // 180-degree phase angle at (0,0).
const CURSOR_WRAP_AROUND_TOLERANCE = Utils.toRadians( 5 /* degrees */ );

type SelfOptions = EmptySelfOptions;

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

  //TODO document
  private readonly cursorAngleProperty: NumberProperty;
  private readonly startAngleProperty: NumberProperty;
  private readonly endAngleProperty: NumberProperty;

  public constructor( acPowerSupply: ACPowerSupply, providedOptions?: VoltageChartNodeOptions ) {

    // Vertical space above and below the largest waveform
    const yMargin = 0.05 * acPowerSupply.voltageProperty.range.getLength();

    const chartTransform = new ChartTransform( {
      viewWidth: VIEW_SIZE.width,
      viewHeight: VIEW_SIZE.height,
      modelXRange: new Range( -VIEW_SIZE.width / 2, VIEW_SIZE.width / 2 ),
      modelYRange: new Range( acPowerSupply.voltageProperty.range.min - yMargin, acPowerSupply.voltageProperty.range.max + yMargin )
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: 'black',
      stroke: null,
      cornerXRadius: 6,
      cornerYRadius: 6
    } );

    // Create a dataSet with a fixed number of points and fixed x values, with x=0 at the center point.
    // We'll recompute the y values and call wavePlot.update.
    const waveDataSet: Vector2[] = [];
    const dx = chartTransform.modelXRange.getLength() / NUMBER_OF_POINTS;
    const maxX = chartTransform.modelXRange.max + dx; // Go one point beyond modelXRange. Plot will be clipped to the chart.
    for ( let x = 0; x <= maxX; x += dx ) {
      waveDataSet.push( new Vector2( x, 0 ) );
      if ( x !== 0 ) {
        waveDataSet.unshift( new Vector2( -x, 0 ) );
      }
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

    const decorationsNode = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [

        // x & y tick marks
        new TickMarkSet( chartTransform, Orientation.HORIZONTAL,
          chartTransform.modelXRange.getLength() / X_AXIS_TICK_SPACING, TICK_MARK_SET_OPTIONS ),
        new TickMarkSet( chartTransform, Orientation.VERTICAL,
          chartTransform.modelYRange.getLength() / Y_AXIS_TICK_SPACING, TICK_MARK_SET_OPTIONS ),

        // x & y axes
        new AxisLine( chartTransform, Orientation.HORIZONTAL, AXIS_LINE_OPTIONS ),
        new AxisLine( chartTransform, Orientation.VERTICAL, AXIS_LINE_OPTIONS ),

        // plots
        wavePlot,
        cursorPlot
      ]
    } );

    const options = optionize<VoltageChartNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      children: [ chartRectangle, decorationsNode ],
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    this.acPowerSupply = acPowerSupply;

    this.chartTransform = chartTransform;
    this.wavePlot = wavePlot;
    this.waveDataSet = waveDataSet;
    this.cursorPlot = cursorPlot;
    this.cursorDataSet = cursorDataSet;

    this.startAngleProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'startAngleProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );

    this.endAngleProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'endAngleProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );

    this.cursorAngleProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'cursorAngleProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );

    Multilink.multilink( [ acPowerSupply.frequencyProperty, acPowerSupply.maxVoltageProperty ], () => this.updateWave() );

    Multilink.multilink( [ this.startAngleProperty, this.endAngleProperty ],
      () => {
        this.cursorAngleProperty.reset();
        this.updateCursor();
      } );

    acPowerSupply.stepAngleProperty.link( () => this.updateCursor() );
  }

  //TODO Start in middle and work out to do half as many computations.
  /**
   * Updates the wave shown on the chart.
   */
  private updateWave(): void {

    // Number of wave cycles to plot at the current frequency.
    const numberOfCycles = this.acPowerSupply.frequencyProperty.value * MAX_CYCLES;

    // Change in angle per change in x.
    const deltaAngle = ( 2 * Math.PI * numberOfCycles ) / this.chartTransform.modelXRange.getLength();

    // Mutate waveDataSet
    let angle = 0;
    this.waveDataSet.forEach( point => {
      angle = PHASE_ANGLE + ( point.x * deltaAngle );
      const y = ( this.acPowerSupply.maxVoltageProperty.value ) * Math.sin( angle );
      point.setY( y );
    } );

    // Since we mutated waveDataSet, calling update is our responsibility.
    this.wavePlot.update();

    // Make the start & end angles positive values, maintaining phase.
    this.startAngleProperty.value = ( ( 2 * Math.PI ) - ( angle % ( 2 * Math.PI ) ) ) % ( 2 * Math.PI );
    this.endAngleProperty.value = this.startAngleProperty.value + ( 2 * ( angle - PHASE_ANGLE ) );
  }

  //TODO This is not behaving as expected.
  /**
   * Updates the cursor to indicate where time === now.
   */
  private updateCursor(): void {

    let cursorAngle = this.cursorAngleProperty.value + this.acPowerSupply.stepAngleProperty.value;

    const startAngle = this.startAngleProperty.value;
    const endAngle = this.endAngleProperty.value;

    // Wrap around.
    if ( cursorAngle >= endAngle ) {
      cursorAngle = cursorAngle % ( 2 * Math.PI );
      if ( cursorAngle > startAngle + CURSOR_WRAP_AROUND_TOLERANCE ) {
        cursorAngle -= ( 2 * Math.PI );
      }
    }

    // Update the dataSet used to draw the cursor.
    const percent = ( cursorAngle - startAngle ) / ( endAngle - startAngle );
    const x = this.chartTransform.modelXRange.min + ( percent * this.chartTransform.modelXRange.getLength() );
    this.cursorDataSet[ 0 ].setX( x );
    this.cursorDataSet[ 1 ].setX( x );
    this.cursorPlot.update();

    this.cursorAngleProperty.value = cursorAngle;
  }
}

faradaysElectromagneticLab.register( 'VoltageChartNode', VoltageChartNode );