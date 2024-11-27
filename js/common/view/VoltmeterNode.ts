// Copyright 2023-2024, University of Colorado Boulder

/**
 * VoltmeterNode is the visualization of the voltmeter, used as an indicator of current in the pickup coil.
 * The origin is at the center bottom of the body.
 *
 * This is based on VoltmeterGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedRectangle, { ShadedRectangleOptions } from '../../../../scenery-phet/js/ShadedRectangle.js';
import { Circle, Line, Node, NodeOptions, NodeTranslationOptions, Path, PathOptions, ProfileColorProperty, Text, TextOptions } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELColors from '../FELColors.js';
import CurrentIndicator from '../model/CurrentIndicator.js';
import Voltmeter from '../model/Voltmeter.js';
import ResistorNode from './ResistorNode.js';

// Body and display area
const BODY_BOUNDS = new Bounds2( 0, 0, 172, 112 );
const X_MARGIN = 10;
const TOP_MARGIN = 10;
const BOTTOM_MARGIN = 15;
const DISPLAY_BOUNDS = new Bounds2( X_MARGIN, TOP_MARGIN, BODY_BOUNDS.width - X_MARGIN, BODY_BOUNDS.height - TOP_MARGIN - BOTTOM_MARGIN );
const CORNER_RADIUS = 10;
const NEEDLE_LENGTH = ( 0.80 * DISPLAY_BOUNDS.height );
const GAUGE_RADIUS = NEEDLE_LENGTH;
const PROBE_SIZE = new Dimension2( 9, 25 );
const RESISTOR_SIZE = new Dimension2( 50, 20 );

// Options shared by VoltmeterNode and its icon
const BODY_OPTIONS: ShadedRectangleOptions = {
  lightSource: 'leftTop',
  baseColor: FELColors.voltmeterBodyColorProperty,
  cornerRadius: CORNER_RADIUS
};
const DISPLAY_OPTIONS: ShadedRectangleOptions = {
  lightSource: 'rightBottom', // opposite BODY_OPTIONS.lightSource, so that the display feels inset
  baseColor: FELColors.voltmeterDisplayColorProperty,
  cornerRadius: CORNER_RADIUS
};
const NEEDLE_OPTIONS: ArrowNodeOptions = {
  headHeight: 15,
  headWidth: 12,
  tailWidth: 3,
  fill: FELColors.voltmeterNeedleColorProperty,
  stroke: null
};
const GAUGE_TEXT_OPTIONS: TextOptions = {
  font: new PhetFont( { size: 20, weight: 'bold' } ),
  fill: FELColors.voltmeterGaugeColorProperty
};

// Tick marks on the gauge
const NUMBER_OF_TICKS = 40;
const TICK_SPACING = Math.PI / NUMBER_OF_TICKS; // radians
const MINOR_TICKS_PER_MAJOR_TICK = 4;
const MAJOR_TICK_LENGTH = 8;
const MINOR_TICK_LENGTH = 4;
const MINOR_TICK_SHAPE = Shape.lineSegment( 0, -GAUGE_RADIUS, 0, -GAUGE_RADIUS + MINOR_TICK_LENGTH );
const MAJOR_TICK_SHAPE = Shape.lineSegment( 0, -GAUGE_RADIUS, 0, -GAUGE_RADIUS + MAJOR_TICK_LENGTH );

export default class VoltmeterNode extends Node {

  public constructor( voltmeter: Voltmeter,
                      currentIndicatorProperty: TReadOnlyProperty<CurrentIndicator>,
                      coilNodeBoundsProperty: TReadOnlyProperty<Bounds2>,
                      tandem: Tandem ) {

    const bodyNode = new ShadedRectangle( BODY_BOUNDS, BODY_OPTIONS );

    // The area where the gauge and needle are displayed
    const displayNode = new ShadedRectangle( DISPLAY_BOUNDS, DISPLAY_OPTIONS );

    // 'voltage' below the display
    const voltageText = new Text( FaradaysElectromagneticLabStrings.voltageStringProperty, {
      font: new PhetFont( 12 ),
      fill: FELColors.voltageLabelColorProperty,
      maxWidth: displayNode.width,
      maxHeight: 0.85 * Math.abs( bodyNode.bottom - displayNode.bottom )
    } );
    voltageText.boundsProperty.link( () => {
      voltageText.centerX = displayNode.centerX;
      voltageText.centerY = displayNode.bottom + ( Math.abs( displayNode.bottom - bodyNode.bottom ) / 2 );
    } );

    // Needle points straight up
    const needleNode = new ArrowNode( 0, 0, 0, -NEEDLE_LENGTH, combineOptions<ArrowNodeOptions>( {}, NEEDLE_OPTIONS, {
      x: displayNode.centerX,
      y: displayNode.bottom - Math.abs( ( DISPLAY_BOUNDS.height - NEEDLE_LENGTH ) / 2 )
    } ) );

    // Screw that holds the needle in place.
    const screwNode = new Circle( {
      radius: 4.5,
      fill: FELColors.voltmeterNeedleColorProperty,
      center: needleNode.centerBottom
    } );

    // The gauge, a 180-degree corded arc with tick marks around its edge.
    const gaugeNode = new GaugeNode( {
      centerX: needleNode.centerX,
      bottom: needleNode.bottom
    } );

    // Probes below the body of the voltmeter, for connecting the voltmeter to the circuit
    const positiveProbeNode = new ProbeNode(
      FELColors.voltMeterPositiveProbeFillProperty,
      FELColors.voltmeterPositiveProbeStrokeProperty, {
        centerX: bodyNode.centerX - RESISTOR_SIZE.width / 2 - 2,
        top: bodyNode.bottom - 1
      } );
    const negativeProbeNode = new ProbeNode(
      FELColors.voltmeterNegativeProbeFillProperty,
      FELColors.voltmeterNegativeProbeStrokeProperty, {
        centerX: bodyNode.centerX + RESISTOR_SIZE.width / 2 + 2,
        top: bodyNode.bottom - 1
      } );

    // Wire ends for the resistor, dynamically sized to connect the ends of the pickup coil.
    const wireNode = new Line( 0, 0, 1, 0, {
      stroke: FELColors.voltmeterWireFillProperty,
      lineWidth: 8,
      lineCap: 'round',
      lineJoin: 'bevel',
      fillPickable: false,
      strokePickable: true
    } );
    coilNodeBoundsProperty.link( coilNodeBounds => {
      wireNode.setLine( 0, 0, coilNodeBounds.width, 0 );
      wireNode.centerX = bodyNode.centerX;
      wireNode.top = positiveProbeNode.bottom - 1;
    } );

    // Resistor
    const resistorNode = new ResistorNode( {
      size: RESISTOR_SIZE,
      bodyFill: FELColors.resistorFillProperty,
      bodyStroke: FELColors.resistorStrokeProperty,
      valueBandColors: [
        FELColors.resistorBand1ColorProperty,
        FELColors.resistorBand2ColorProperty,
        FELColors.resistorBand3ColorProperty
      ],
      toleranceBandColor: FELColors.resistorBand4ColorProperty,
      center: wireNode.center
    } );

    super( {
      children: [ wireNode, resistorNode, positiveProbeNode, negativeProbeNode, bodyNode, displayNode, voltageText, gaugeNode, needleNode, screwNode ],
      visibleProperty: new DerivedProperty( [ currentIndicatorProperty ], indicator => ( indicator === voltmeter ), {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      // We do not want the user to drag the pickup coil by its voltmeter.
      // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/189
      pickable: false,
      tandem: tandem,
      phetioFeatured: true
    } );

    this.addLinkedElement( voltmeter );

    voltmeter.needleAngleProperty.link( needleAngle => {
      needleNode.rotation = needleAngle;
    } );
  }

  /**
   * Creates an icon for the voltmeter. This is a simplified version of VoltmeterNode, with most details removed.
   */
  public static createIcon( scale = 0.3 ): Node {

    const bodyNode = new ShadedRectangle( BODY_BOUNDS, BODY_OPTIONS );

    const displayNode = new ShadedRectangle( DISPLAY_BOUNDS, DISPLAY_OPTIONS );

    const needleNode = new ArrowNode( 0, 0, 0, -NEEDLE_LENGTH, combineOptions<ArrowNodeOptions>( {}, NEEDLE_OPTIONS, {
      headHeight: 25,
      headWidth: 20,
      tailWidth: 5,
      x: displayNode.centerX,
      centerY: displayNode.centerY
    } ) );

    return new Node( {
      children: [ bodyNode, displayNode, needleNode ],
      scale: scale,
      pickable: false
    } );
  }
}

/**
 * GaugeNode is the voltmeter's gauge. It is a half circle, with tick marks around the inside edge, and a vertical
 * line down the center.
 */
class GaugeNode extends Node {

  public constructor( nodeTranslationOptions?: NodeTranslationOptions ) {

    // 180-degree arc, with a vertical line down the center at zero volts.
    const gaugeShape = new Shape()
      .arc( 0, 0, GAUGE_RADIUS, -Math.PI, 0 )
      .close()
      .moveTo( 0, 0 )
      .lineTo( 0, -GAUGE_RADIUS );
    const gaugePath = new Path( gaugeShape, {
      stroke: FELColors.voltmeterGaugeColorProperty,
      lineWidth: 1
    } );

    // Major and minor tick marks around the inside of the gauge, drawn as a single Path.
    // This starts at the vertical center and works out in the positive and negative directions simultaneously.
    const tickShapes: Shape[] = [];
    let angle = TICK_SPACING;
    let tickCount = 1; // Skip the major tick that overlaps the vertical line in the center of the gauge.
    while ( angle < Math.PI / 2 ) {
      const tickShape = ( tickCount % MINOR_TICKS_PER_MAJOR_TICK === 0 ) ? MAJOR_TICK_SHAPE : MINOR_TICK_SHAPE;
      tickShapes.push( tickShape.transformed( Matrix3.rotationAround( angle, 0, 0 ) ) ); // positive tick
      tickShapes.push( tickShape.transformed( Matrix3.rotationAround( -angle, 0, 0 ) ) ); // negative tick
      angle += TICK_SPACING;
      tickCount++;
    }
    const ticksPath = new Path( new Shape( tickShapes.flatMap( shape => shape.subpaths ) ), {
      stroke: FELColors.voltmeterGaugeColorProperty
    } );

    // '-' and '+' labels, centered in the left and right halves of the gauge.
    const vector = Vector2.createPolar( GAUGE_RADIUS / 2, Math.PI / 4 );
    const negativeText = new Text( MathSymbols.MINUS,
      combineOptions<TextOptions>( {}, GAUGE_TEXT_OPTIONS, {
        centerX: -vector.x,
        centerY: -vector.y
      } ) );
    const positiveText = new Text( MathSymbols.PLUS,
      combineOptions<TextOptions>( {}, GAUGE_TEXT_OPTIONS, {
        centerX: vector.x,
        centerY: -vector.y
      } ) );

    super( combineOptions<NodeOptions>( {
      children: [ gaugePath, ticksPath, negativeText, positiveText ],
      pickable: false
    }, nodeTranslationOptions ) );
  }
}

/**
 * ProbeNode is the positive and negative probes that stick out of the bottom of the voltmeter, used to connect
 * the voltmeter across the resistor.
 */
class ProbeNode extends Path {

  public constructor( fillProperty: ProfileColorProperty, strokeProperty: ProfileColorProperty, nodeTranslationOptions?: NodeTranslationOptions ) {

    const w = PROBE_SIZE.width;
    const h = PROBE_SIZE.height;

    // Clockwise from left top
    const shape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( w, 0 )
      .lineTo( w, 0.5 * h )
      .lineTo( w / 2, h )
      .lineTo( 0, 0.5 * h )
      .close();

    super( shape, combineOptions<PathOptions>( {
      fill: fillProperty,
      stroke: strokeProperty
    }, nodeTranslationOptions ) );
  }
}

faradaysElectromagneticLab.register( 'VoltmeterNode', VoltmeterNode );