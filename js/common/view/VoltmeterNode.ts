// Copyright 2023, University of Colorado Boulder

/**
 * VoltmeterNode is the visualization of the voltmeter, used as an indicator of current in the pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Circle, Node, NodeOptions, NodeTranslationOptions, Path, Text } from '../../../../scenery/js/imports.js';
import Voltmeter from '../model/Voltmeter.js';
import ShadedRectangle, { ShadedRectangleOptions } from '../../../../scenery-phet/js/ShadedRectangle.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Indicator } from '../model/Indicator.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import FELColors from '../FELColors.js';
import { Shape } from '../../../../kite/js/imports.js';

// Body and display area
const BODY_BOUNDS = new Bounds2( 0, 0, 172, 112 );
const X_MARGIN = 10;
const TOP_MARGIN = 10;
const BOTTOM_MARGIN = 15;
const DISPLAY_BOUNDS = new Bounds2( X_MARGIN, TOP_MARGIN, BODY_BOUNDS.width - X_MARGIN, BODY_BOUNDS.height - TOP_MARGIN - BOTTOM_MARGIN );
const CORNER_RADIUS = 10;
const NEEDLE_LENGTH = ( 0.80 * DISPLAY_BOUNDS.height );

// Options shared by VoltmeterNode and its icon
const BODY_OPTIONS: ShadedRectangleOptions = {
  baseColor: FELColors.voltmeterBodyColorProperty,
  cornerRadius: CORNER_RADIUS
};
const DISPLAY_OPTIONS: ShadedRectangleOptions = {
  baseColor: FELColors.voltmeterDisplayColorProperty,
  cornerRadius: CORNER_RADIUS
};
const NEEDLE_OPTIONS: ArrowNodeOptions = {
  headHeight: 15,
  headWidth: 12,
  tailWidth: 3,
  fill: FELColors.voltmeterNeedleColorProperty
};

type SelfOptions = EmptySelfOptions;

type VoltmeterNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem'>;

export default class VoltmeterNode extends Node {

  public constructor( voltmeter: Voltmeter, indicatorProperty: TReadOnlyProperty<Indicator>, providedOptions: VoltmeterNodeOptions ) {

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

    // Meter gauge, a 180-degree corded arc, with a vertical line down the center.
    const gaugeShape = new Shape()
      .arc( 0, 0, NEEDLE_LENGTH, -Math.PI, 0 )
      .close()
      .moveTo( 0, 0 )
      .lineTo( 0, -NEEDLE_LENGTH );
    const gaugeNode = new Path( gaugeShape, {
      stroke: FELColors.voltmeterGaugeColorProperty,
      centerX: needleNode.centerX,
      bottom: needleNode.bottom
    } );

    const options = optionize<VoltmeterNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      children: [ bodyNode, displayNode, voltageText, gaugeNode, needleNode, screwNode ],
      visibleProperty: new DerivedProperty( [ indicatorProperty ], indicator => ( indicator === 'voltmeter' ), {
        tandem: providedOptions.tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } )
    }, providedOptions );

    super( options );

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

    const needleNode = new ArrowNode( 0, 0, 0, -NEEDLE_LENGTH, {
      x: displayNode.centerX,
      y: displayNode.bottom - Math.abs( ( DISPLAY_BOUNDS.height - NEEDLE_LENGTH ) / 2 )
    } );

    return new Node( {
      children: [ bodyNode, displayNode, needleNode ],
      scale: scale
    } );
  }
}

faradaysElectromagneticLab.register( 'VoltmeterNode', VoltmeterNode );