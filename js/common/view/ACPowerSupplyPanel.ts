// Copyright 2023-2024, University of Colorado Boulder

//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/163 ariel-phet suggested that this needs pixel polishing.
/**
 * ACPowerSupplyPanel is the view of the AC power supply. It provides sliders for changing the maximum voltage
 * and frequency (as percentages), and depicts the fluctuation of voltage over time as a sine wave.
 *
 * This is based on ACPowerSupplyGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Circle, HBox, Node, Path, Text, VBox } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CurrentSource from '../model/CurrentSource.js';
import ACPowerSupply from '../model/ACPowerSupply.js';
import FELColors from '../FELColors.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import VoltageChartNode from './VoltageChartNode.js';
import ACNumberControl from './ACNumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PowerSupplyPanel, { PowerSupplyPanelOptions } from './PowerSupplyPanel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Orientation from '../../../../phet-core/js/Orientation.js';

type SelfOptions = EmptySelfOptions;

type ACPowerSupplyPanelOptions = SelfOptions & PickRequired<PowerSupplyPanelOptions, 'position' | 'dragBoundsProperty' | 'tandem'>;

export default class ACPowerSupplyPanel extends PowerSupplyPanel {

  public constructor( acPowerSupply: ACPowerSupply,
                      currentSourceProperty: TReadOnlyProperty<CurrentSource>,
                      providedOptions: ACPowerSupplyPanelOptions ) {

    const options = optionize<ACPowerSupplyPanelOptions, SelfOptions, PowerSupplyPanelOptions>()( {

      // PowerSupplyPanelOptions
      fill: FELColors.acPowerSupplyPanelFillProperty,
      stroke: FELColors.acPowerSupplyPanelStrokeProperty
    }, providedOptions );

    // Frequency control
    const frequencyControl = new ACNumberControl( acPowerSupply.frequencyPercentProperty, {
      orientation: Orientation.HORIZONTAL,
      tandem: options.tandem.createTandem( 'frequencyControl' )
    } );

    // Max voltage control
    const maxVoltageControl = new ACNumberControl( acPowerSupply.maxVoltagePercentProperty, {
      orientation: Orientation.VERTICAL,
      tandem: options.tandem.createTandem( 'maxVoltageControl' )
    } );

    // Chart of voltage over time
    const chartNode = new VoltageChartNode( acPowerSupply, {
      viewSize: new Dimension2( 165, 100 )
    } );

    const chartAndSliders = new HBox( {
      children: [
        maxVoltageControl,
        new VBox( {
          align: 'right',
          spacing: 5,
          children: [ chartNode, frequencyControl ]
        } )
      ],
      align: 'top',
      spacing: 5
    } );

    const titleText = new Text( FaradaysElectromagneticLabStrings.acPowerSupplyStringProperty, {
      font: new PhetFont( { size: 14, weight: 'bold' } ),
      maxWidth: 1.1 * chartNode.width
    } );
    const titleIcon = ACPowerSupplyPanel.createIcon( 0.5 );
    const titleNode = new HBox( {
      children: [ titleText, titleIcon ],
      spacing: 10
    } );

    const contentNode = new VBox( {
      children: [
        titleNode,
        chartAndSliders
      ],
      spacing: 6,
      align: 'center'
    } );

    super( contentNode, acPowerSupply, currentSourceProperty, options );
  }

  /**
   * Creates an icon for the AC power supply. This is the universal symbol for AC power.
   */
  public static createIcon( scale = 1 ): Node {

    const circle = new Circle( {
      radius: 18,
      fill: FELColors.acPowerSupplyChartProperty
    } );

    // Sine wave symbol
    const sineDataSet = createSineDataSet( 0, 25, 25, -8, 1 );
    const sineShape = new Shape().moveToPoint( sineDataSet[ 0 ] );
    for ( let i = 1; i < sineDataSet.length; i++ ) {
      sineShape.lineToPoint( sineDataSet[ i ] );
    }
    const sinePath = new Path( sineShape, {
      stroke: FELColors.acPowerSupplyWaveColorProperty,
      lineWidth: 3,
      center: circle.center
    } );

    return new Node( {
      children: [ circle, sinePath ],
      pickable: false,
      scale: scale
    } );
  }
}

/**
 * Creates a data set for a sine wave, an array of Vector2, ordered by ascending x value.
 */
function createSineDataSet( xMin: number, xMax: number, period: number, amplitude: number, delta: number ): Vector2[] {
  const dataSet = [];
  const frequency = 2 * Math.PI / period;
  for ( let x = xMin; x <= xMax; x += delta ) {
    dataSet.push( new Vector2( x, amplitude * Math.sin( x * frequency ) ) );
  }
  return dataSet;
}

faradaysElectromagneticLab.register( 'ACPowerSupplyPanel', ACPowerSupplyPanel );