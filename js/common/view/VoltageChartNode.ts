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
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import LinePlot from '../../../../bamboo/js/LinePlot.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import FELColors from '../FELColors.js';

const AXIS_LINE_OPTIONS: AxisLineOptions = {
  stroke: Color.grayColor( 200 ), //TODO color profile
  lineWidth: 0.5
};
const TICK_MARK_SET_OPTIONS: TickMarkSetOptions = {
  stroke: Color.grayColor( 200 ), //TODO color profile
  lineWidth: 0.5,
  extent: 10
};
const VIEW_SIZE = new Dimension2( 156, 122 );
const X_AXIS_TICK_SPACING = 10;
const Y_AXIS_TICK_SPACING = 10;
const NUMBER_OF_POINTS_PER_CYCLE = 100;

type SelfOptions = EmptySelfOptions;

type VoltageChartNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem'>;

export default class VoltageChartNode extends Node {

  private readonly frequencyProperty: TReadOnlyProperty<number>;
  private readonly maxVoltageProperty: TReadOnlyProperty<number>;
  private readonly maxCycles: number;

  private readonly chartTransform: ChartTransform;
  private readonly plot: LinePlot;

  //TODO document
  public readonly startAngleProperty: TReadOnlyProperty<number>;
  private readonly _startAngleProperty: NumberProperty;

  //TODO document
  public readonly endAngleProperty: TReadOnlyProperty<number>;
  private readonly _endAngleProperty: NumberProperty;

  public constructor( frequencyProperty: TReadOnlyProperty<number>, frequencyRange: Range,
                      maxVoltageProperty: TReadOnlyProperty<number>, voltageRange: Range,
                      providedOptions?: VoltageChartNodeOptions ) {

    // Vertical space above and below the largest waveform
    const yMargin = 0.05 * voltageRange.getLength();

    const chartTransform = new ChartTransform( {
      viewWidth: VIEW_SIZE.width,
      viewHeight: VIEW_SIZE.height,
      modelXRange: new Range( -VIEW_SIZE.width / 2, VIEW_SIZE.width / 2 ),
      modelYRange: new Range( voltageRange.min - yMargin, voltageRange.max + yMargin )
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: 'black',
      stroke: null,
      cornerXRadius: 6,
      cornerYRadius: 6
    } );

    //TODO Create a dataSet with a fixed number of points and fixed x values, then reuse it and call plot.update.
    const plot = new LinePlot( chartTransform, [], {
      stroke: FELColors.acPowerSupplyWaveColorProperty,
      lineWidth: 1.5
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

        // plot
        plot
      ]
    } );

    const options = optionize<VoltageChartNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      children: [ chartRectangle, decorationsNode ]
    }, providedOptions );

    super( options );

    this.frequencyProperty = frequencyProperty;
    this.maxVoltageProperty = maxVoltageProperty;

    assert && assert( frequencyRange.min !== 0 );
    this.maxCycles = frequencyRange.max / frequencyRange.min;

    this.chartTransform = chartTransform;
    this.plot = plot;

    this._startAngleProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'startAngleProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
    this.startAngleProperty = this._startAngleProperty;

    this._endAngleProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'endAngleProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
    this.endAngleProperty = this._endAngleProperty;

    Multilink.multilink( [ frequencyProperty, maxVoltageProperty ], () => this.update() );
  }

  private update(): void {

    // The dataSet that we'll populate.
    const dataSet: Vector2[] = [];

    // Number of wave cycles to plot at the current frequency.
    const numberOfCycles = this.frequencyProperty.value * this.maxCycles;

    // Number of points increases as we need to draw more cycles.
    const numberOfPoints = ( numberOfCycles * NUMBER_OF_POINTS_PER_CYCLE );

    // Change in angle per change in x.
    const deltaAngle = ( 2 * Math.PI * numberOfCycles ) / this.chartTransform.modelXRange.getLength();

    // 180-degree phase angle at (0,0).
    const phaseAngle = Math.PI;

    const dx = this.chartTransform.modelXRange.getLength() / numberOfPoints;

    // Go one point beyond modelXRange. Plot will be clipped to the chart.
    const maxX = this.chartTransform.modelXRange.max + dx;

    // Populate the dataSet by starting at x=0 and working outwards in positive and negative directions.
    let angle = 0;
    for ( let x = 0; x <= maxX; x += dx ) {
      angle = phaseAngle + ( x * deltaAngle );
      const y = ( this.maxVoltageProperty.value ) * Math.sin( angle );
      dataSet.push( new Vector2( x, -y ) ); //TODO +y is up
      if ( x !== 0 ) {
        dataSet.unshift( new Vector2( -x, y ) ); //TODO +y is up
      }
    }
    this.plot.setDataSet( dataSet );

    // Make the start & end angles positive values, maintaining phase.
    this._startAngleProperty.value = ( ( 2 * Math.PI ) - ( angle % ( 2 * Math.PI ) ) ) % ( 2 * Math.PI );
    this._endAngleProperty.value = this._startAngleProperty.value + ( 2 * ( angle - phaseAngle ) );
  }
}

faradaysElectromagneticLab.register( 'VoltageChartNode', VoltageChartNode );