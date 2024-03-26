// Copyright 2023-2024, University of Colorado Boulder

/**
 * ACPowerSupplyNode is the view of the AC power supply. It provides sliders for changing the maximum voltage
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
import Tandem from '../../../../tandem/js/Tandem.js';
import ACPowerSupply from '../model/ACPowerSupply.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import FELColors from '../FELColors.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import FELConstants from '../FELConstants.js';
import VoltageChartNode from './VoltageChartNode.js';
import ACNumberControl from './ACNumberControl.js';
import ShadedRectangle, { ShadedRectangleOptions } from '../../../../scenery-phet/js/ShadedRectangle.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

const CORNER_RADIUS = 10;
const BODY_X_MARGIN = 12;
const BODY_Y_MARGIN = 8;
const BODY_OPTIONS: ShadedRectangleOptions = {
  lightSource: 'leftTop',
  baseColor: FELColors.acPowerSupplyBodyColorProperty,
  cornerRadius: CORNER_RADIUS
};

export default class ACPowerSupplyNode extends Node {

  public constructor( acPowerSupply: ACPowerSupply, currentSourceProperty: TReadOnlyProperty<CurrentSource>, tandem: Tandem ) {

    // Frequency control
    const frequencyControl = new ACNumberControl( acPowerSupply.frequencyPercentProperty, {
      orientation: 'horizontal',
      tandem: tandem.createTandem( 'frequencyControl' )
    } );

    // Max voltage control
    const maxVoltageControl = new ACNumberControl( acPowerSupply.maxVoltagePercentProperty, {
      orientation: 'vertical',
      tandem: tandem.createTandem( 'maxVoltageControl' )
    } );

    // Chart of voltage over time
    const chartNode = new VoltageChartNode( acPowerSupply, {
      viewSize: new Dimension2( 165, 122 )
    } );

    const chartAndSliders = new HBox( {
      children: [
        maxVoltageControl,
        new VBox( {
          align: 'right',
          spacing: 8,
          children: [ chartNode, frequencyControl ]
        } )
      ],
      align: 'top',
      spacing: 8
    } );

    const titleText = new Text( FaradaysElectromagneticLabStrings.acPowerSupplyStringProperty, {
      font: FELConstants.TITLE_FONT,
      maxWidth: chartNode.width
    } );

    const contentNode = new VBox( {
      children: [
        titleText,
        chartAndSliders
      ],
      spacing: 8,
      align: 'center'
    } );

    super( {
      children: [ contentNode ],
      visibleProperty: new DerivedProperty( [ currentSourceProperty ], currentSource => ( currentSource === acPowerSupply ), {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      tandem: tandem,
      phetioFeatured: true
    } );

    // Body of the AC power supply, sized to fit. Because ShadedRectangle is not resizable, we need to create a new one
    // if the size of contentNode is changed by making elements invisible via PhET-iO.
    let bodyNode: Node;
    contentNode.boundsProperty.link( () => {
      if ( bodyNode && this.hasChild( bodyNode ) ) {
        this.removeChild( bodyNode );
      }
      bodyNode = new ShadedRectangle( new Bounds2( 0, 0, contentNode.width + ( 2 * BODY_X_MARGIN ), contentNode.height + ( 2 * BODY_Y_MARGIN ) ), BODY_OPTIONS );
      this.addChild( bodyNode );
      bodyNode.moveToBack();
      contentNode.center = bodyNode.center;
    } );

    // Interrupt interaction when this Node becomes invisible.
    this.visibleProperty.lazyLink( visible => !visible && this.interruptSubtreeInput() );

    this.addLinkedElement( acPowerSupply );
  }

  /**
   * Creates an icon for the AC power supply. This is the universal symbol for AC power.
   */
  public static createIcon( scale = 1 ): Node {

    const circle = new Circle( {
      radius: 18,
      fill: FELColors.acPowerSupplyDisplayColorProperty
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

faradaysElectromagneticLab.register( 'ACPowerSupplyNode', ACPowerSupplyNode );