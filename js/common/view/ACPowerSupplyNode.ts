// Copyright 2023-2024, University of Colorado Boulder

/**
 * ACPowerSupplyNode is the view of the AC power supply. It provides sliders for changing the maximum voltage
 * and frequency, and depicts the current settings as a sine wave.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Circle, FlowBox, FlowBoxOptions, Node, NodeTranslationOptions, Path, Text, VBox } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CurrentSource from '../model/CurrentSource.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ACPowerSupply from '../model/ACPowerSupply.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import ShadedRectangle, { ShadedRectangleOptions } from '../../../../scenery-phet/js/ShadedRectangle.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import FELColors from '../FELColors.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import StringDisplay from './StringDisplay.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import FELConstants from '../FELConstants.js';
import VoltageChartNode from './VoltageChartNode.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Slider, { SliderOptions } from '../../../../sun/js/Slider.js';
import Orientation from '../../../../phet-core/js/Orientation.js';

const CORNER_RADIUS = 10;
const BODY_X_MARGIN = 12;
const BODY_Y_MARGIN = 8;
const BODY_OPTIONS: ShadedRectangleOptions = {
  lightSource: 'leftTop',
  baseColor: FELColors.acPowerSupplyBodyColorProperty,
  cornerRadius: CORNER_RADIUS
};
const FONT = new PhetFont( 12 );
const STRING_DISPLAY_SIZE = new Dimension2( 38, 20 );

export default class ACPowerSupplyNode extends Node {

  public constructor( acPowerSupply: ACPowerSupply, currentSourceProperty: TReadOnlyProperty<CurrentSource>, tandem: Tandem ) {

    // Chart of voltage over time
    const chartNode = new VoltageChartNode( acPowerSupply, {
      viewSize: new Dimension2( 156, 122 ),
      tandem: tandem.createTandem( 'chartNode' )
    } );

    // Frequency control
    const frequencyControl = new PercentValueControl( acPowerSupply.frequencyProperty, {
      orientation: 'horizontal',
      right: chartNode.right,
      top: chartNode.bottom + 10,
      tandem: tandem.createTandem( 'frequencyControl' )
    } );

    // Max voltage control
    const maxVoltageControl = new PercentValueControl( acPowerSupply.maxVoltagePercentProperty, {
      orientation: 'vertical',
      right: chartNode.left - 10,
      top: chartNode.top,
      tandem: tandem.createTandem( 'maxVoltageControl' )
    } );

    const chartAndSliders = new Node( {
      children: [ chartNode, frequencyControl, maxVoltageControl ]
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

    // Body of the AC power supply, sized to fit.
    const bodyNode = new ShadedRectangle( new Bounds2( 0, 0, contentNode.width + ( 2 * BODY_X_MARGIN ), contentNode.height + ( 2 * BODY_Y_MARGIN ) ), BODY_OPTIONS );
    contentNode.center = bodyNode.center;

    super( {
      children: [ bodyNode, contentNode ],
      visibleProperty: new DerivedProperty( [ currentSourceProperty ], currentSource => ( currentSource === acPowerSupply ), {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      tandem: tandem,
      phetioFeatured: true
    } );

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
      pickable: false
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

/**
 * PercentValueControl displays a NumberProperty as a percent, and provides a slider to change the value.
 * TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/61 replace PercentValueControl with NumberControl
 */

type PercentValueControlSelfOptions = {
  sliderStep?: number;
  spacing?: number;
};

type PercentValueControlOptions = PercentValueControlSelfOptions & NodeTranslationOptions &
  PickRequired<FlowBoxOptions, 'orientation' | 'tandem'>;

class PercentValueControl extends FlowBox {

  public constructor( valueProperty: NumberProperty, providedOptions: PercentValueControlOptions ) {

    const options = optionize<PercentValueControlOptions, PercentValueControlSelfOptions, FlowBoxOptions>()( {

      // SelfOptions
      sliderStep: 1,
      spacing: 5,

      // FlowBoxOptions
      excludeInvisibleChildrenFromBounds: false,
      align: 'center'
    }, providedOptions );

    const stringProperty = new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty, {
      value: new DerivedStringProperty( [ valueProperty ], value => Utils.toFixed( value, 0 ) )
    } );

    const valueDisplay = new StringDisplay( stringProperty, {
      size: STRING_DISPLAY_SIZE,
      rectangleOptions: {
        fill: FELColors.acPowerSupplyDisplayColorProperty
      },
      textOptions: {
        fill: FELColors.acPowerSupplyTextColorProperty,
        font: FONT
      },
      tandem: options.tandem.createTandem( 'valueDisplay' ),
      phetioVisiblePropertyInstrumented: true
    } );

    const slider = new Slider( valueProperty, valueProperty.range,
      combineOptions<SliderOptions>( {
        orientation: options.orientation === 'horizontal' ? Orientation.HORIZONTAL : Orientation.VERTICAL,
        constrainValue: ( value: number ) => Utils.roundToInterval( value, options.sliderStep ),
        tandem: options.tandem.createTandem( 'slider' )
      }, FELConstants.PERCENT_SLIDER_OPTIONS ) );

    options.children = ( options.orientation === 'horizontal' ) ? [ slider, valueDisplay ] : [ valueDisplay, slider ];

    super( options );
  }
}

faradaysElectromagneticLab.register( 'ACPowerSupplyNode', ACPowerSupplyNode );