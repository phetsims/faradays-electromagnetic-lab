// Copyright 2023, University of Colorado Boulder

//TODO OK to omit probes and resistor that are shown in the Java version?

/**
 * VoltmeterNode is the visualization of the voltmeter, used as an indicator of current in the pickup coil.
 * The origin is at the center bottom of the body.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Circle, Line, Node, NodeOptions, NodeTranslationOptions, Path, Text, TextOptions } from '../../../../scenery/js/imports.js';
import Voltmeter from '../model/Voltmeter.js';
import ShadedRectangle, { ShadedRectangleOptions } from '../../../../scenery-phet/js/ShadedRectangle.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { CurrentIndicator } from '../model/CurrentIndicator.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import FELColors from '../FELColors.js';
import { Shape } from '../../../../kite/js/imports.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// Body and display area
const BODY_BOUNDS = new Bounds2( 0, 0, 172, 112 );
const X_MARGIN = 10;
const TOP_MARGIN = 10;
const BOTTOM_MARGIN = 15;
const DISPLAY_BOUNDS = new Bounds2( X_MARGIN, TOP_MARGIN, BODY_BOUNDS.width - X_MARGIN, BODY_BOUNDS.height - TOP_MARGIN - BOTTOM_MARGIN );
const CORNER_RADIUS = 10;
const NEEDLE_LENGTH = ( 0.80 * DISPLAY_BOUNDS.height );
const GAUGE_RADIUS = NEEDLE_LENGTH;

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

export default class VoltmeterNode extends Node {

  public constructor( voltmeter: Voltmeter, currentIndicatorProperty: TReadOnlyProperty<CurrentIndicator>, tandem: Tandem ) {

    const bodyNode = new ShadedRectangle( BODY_BOUNDS, BODY_OPTIONS );

    const displayNode = new ShadedRectangle( DISPLAY_BOUNDS, DISPLAY_OPTIONS );

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

    const needleNode = new ArrowNode( 0, 0, 0, -NEEDLE_LENGTH, combineOptions<ArrowNodeOptions>( {
      x: displayNode.centerX,
      y: displayNode.bottom - Math.abs( ( DISPLAY_BOUNDS.height - NEEDLE_LENGTH ) / 2 )
    }, NEEDLE_OPTIONS ) );

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

    super( {
      children: [ bodyNode, displayNode, voltageText, gaugeNode, needleNode, screwNode ],
      visibleProperty: new DerivedProperty( [ currentIndicatorProperty ], indicator => ( indicator === 'voltmeter' ), {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      tandem: tandem
    } );

    voltmeter.needleAngleProperty.link( needleAngle => {
      needleNode.rotation = needleAngle;
    } );
  }

  /**
   * Creates an icon for the voltmeter, used to label controls. This is a simplified version of VoltmeterNode, with
   * most of the details removed.
   */
  public static createIcon( scale = 0.3 ): Node {

    const bodyNode = new ShadedRectangle( BODY_BOUNDS, BODY_OPTIONS );

    const displayNode = new ShadedRectangle( DISPLAY_BOUNDS, DISPLAY_OPTIONS );

    const needleNode = new ArrowNode( 0, 0, 0, -NEEDLE_LENGTH, combineOptions<ArrowNodeOptions>( {}, NEEDLE_OPTIONS, {
      headHeight: 25,
      headWidth: 20,
      tailWidth: 5,
      x: displayNode.centerX,
      y: displayNode.bottom - Math.abs( ( DISPLAY_BOUNDS.height - NEEDLE_LENGTH ) / 2 )
    } ) );

    return new Node( {
      children: [ bodyNode, displayNode, needleNode ],
      scale: scale,
      pickable: false
    } );
  }
}

class GaugeNode extends Node {

  public constructor( translationOptions?: NodeTranslationOptions ) {

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

    // Major and minor tick marks around the outer edge of the arc
    //TODO draw ticks with one Path
    const tickNodes: Node[] = [];
    let angle = TICK_SPACING;
    let tickCount = 1;
    while ( angle < Math.PI / 2 ) {

      const tickLength = ( tickCount % MINOR_TICKS_PER_MAJOR_TICK === 0 ) ? MAJOR_TICK_LENGTH : MINOR_TICK_LENGTH;

      const positiveTick = new Line( 0, -GAUGE_RADIUS, 0, -GAUGE_RADIUS + tickLength, {
        stroke: FELColors.voltmeterGaugeColorProperty,
        rotation: angle
      } );
      tickNodes.push( positiveTick );

      const negativeTick = new Line( 0, -GAUGE_RADIUS, 0, -GAUGE_RADIUS + tickLength, {
        stroke: FELColors.voltmeterGaugeColorProperty,
        rotation: -angle
      } );
      tickNodes.push( negativeTick );

      angle += TICK_SPACING;
      tickCount++;
    }

    // '-' and '+' labels, centered in the left and right halves of the gauge.
    const vector = Vector2.createPolar( GAUGE_RADIUS / 2, Math.PI / 4 );
    const negativeText = new Text( MathSymbols.MINUS,
      combineOptions<TextOptions>( {
        centerX: -vector.x,
        centerY: -vector.y
      }, GAUGE_TEXT_OPTIONS ) );
    const positiveText = new Text( MathSymbols.PLUS,
      combineOptions<TextOptions>( {
        centerX: vector.x,
        centerY: -vector.y
      }, GAUGE_TEXT_OPTIONS ) );

    super( combineOptions<NodeOptions>( {
      children: [ gaugePath, ...tickNodes, negativeText, positiveText ],
      pickable: false
    }, translationOptions ) );
  }
}

faradaysElectromagneticLab.register( 'VoltmeterNode', VoltmeterNode );