// Copyright 2023-2024, University of Colorado Boulder

//TODO Use MappedProperty here for converting maxVoltageProperty and frequencyProperty to percent?

/**
 * ACPowerSupplyNode is the view of the AC power supply. It provides sliders for changing the maximum voltage
 * and frequency, and depicts the current settings as a sine wave.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Circle, HBox, Node, Path, VBox } from '../../../../scenery/js/imports.js';
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
import HSlider from '../../../../sun/js/HSlider.js';
import VSlider from '../../../../sun/js/VSlider.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import Utils from '../../../../dot/js/Utils.js';
import StringDisplay from './StringDisplay.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

const BODY_BOUNDS = new Bounds2( 0, 0, 230, 210 );
const CORNER_RADIUS = 10;
const BODY_OPTIONS: ShadedRectangleOptions = {
  lightSource: 'leftTop',
  baseColor: FELColors.acPowerSupplyBodyColorProperty,
  cornerRadius: CORNER_RADIUS
};
const FONT = new PhetFont( 12 );
const STRING_DISPLAY_SIZE = new Dimension2( 38, 20 );

export default class ACPowerSupplyNode extends Node {

  public constructor( acPowerSupply: ACPowerSupply, currentSourceProperty: TReadOnlyProperty<CurrentSource>, tandem: Tandem ) {

    // Body of the AC power supply
    const bodyNode = new ShadedRectangle( BODY_BOUNDS, BODY_OPTIONS );

    // Display for max voltage value, in percent
    const maxVoltageStringProperty = new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty, {
      value: new DerivedProperty( [ acPowerSupply.maxVoltageProperty, acPowerSupply.maxVoltageProperty.rangeProperty ],
        ( maxVoltage, range ) => Utils.toFixed( 100 * maxVoltage / range.max, 0 ) )
    } );
    const maxVoltageDisplay = new StringDisplay( maxVoltageStringProperty, {
      size: STRING_DISPLAY_SIZE,
      rectangleOptions: {
        fill: FELColors.acPowerSupplyDisplayColorProperty
      },
      textOptions: {
        fill: FELColors.acPowerSupplyTextColorProperty,
        font: FONT
      }
    } );

    // Slider for max voltage
    const maxVoltageSlider = new VSlider( acPowerSupply.maxVoltageProperty, acPowerSupply.maxVoltageProperty.range, {
      //TODO thumbFill, thumbFillHighlighted?
      //TODO alt input options
      // keyboardStep: ?,
      // shiftKeyboardStep: ?,
      // pageKeyboardStep: ?,
      left: bodyNode.left + 10,
      centerY: bodyNode.centerY,
      tandem: tandem.createTandem( 'maxVoltageSlider' )
    } );

    // Layout for max voltage display and slider
    const maxVoltageBox = new VBox( {
      children: [ maxVoltageDisplay, maxVoltageSlider ],
      spacing: 5,
      align: 'center',
      left: bodyNode.left + 10,
      centerY: bodyNode.centerY
    } );

    // Display for frequency value, in percent
    const frequencyStringProperty = new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valuePercentStringProperty, {
      value: new DerivedProperty( [ acPowerSupply.frequencyProperty, acPowerSupply.frequencyProperty.rangeProperty ],
        ( frequency, range ) => Utils.toFixed( 100 * frequency / range.max, 0 ) )
    } );
    const frequencyDisplay = new StringDisplay( frequencyStringProperty, {
      size: STRING_DISPLAY_SIZE,
      rectangleOptions: {
        fill: FELColors.acPowerSupplyDisplayColorProperty
      },
      textOptions: {
        fill: FELColors.acPowerSupplyTextColorProperty,
        font: FONT
      }
    } );

    // Slider for frequency
    const frequencySlider = new HSlider( acPowerSupply.frequencyProperty, acPowerSupply.frequencyProperty.range, {
      //TODO thumbFill, thumbFillHighlighted?
      //TODO alt input options
      // keyboardStep: ?,
      // shiftKeyboardStep: ?,
      // pageKeyboardStep: ?,
      tandem: tandem.createTandem( 'frequencySlider' )
    } );

    // Layout for frequency display and slider
    const frequencyBox = new HBox( {
      children: [ frequencySlider, frequencyDisplay ],
      spacing: 5,
      align: 'center',
      centerX: bodyNode.centerX,
      bottom: bodyNode.bottom - 10
    } );

    super( {
      children: [ bodyNode, maxVoltageBox, frequencyBox ],
      visibleProperty: new DerivedProperty( [ currentSourceProperty ], currentSource => ( currentSource === acPowerSupply ), {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      tandem: tandem
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

faradaysElectromagneticLab.register( 'ACPowerSupplyNode', ACPowerSupplyNode );