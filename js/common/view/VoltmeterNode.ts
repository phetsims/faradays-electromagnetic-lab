// Copyright 2023, University of Colorado Boulder

/**
 * VoltmeterNode is the visualization of the voltmeter, used as an indicator of current in the pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Image, Node, NodeOptions, NodeTranslationOptions, Text } from '../../../../scenery/js/imports.js';
import voltmeterIcon_png from '../../../images/voltmeterIcon_png.js';
import Voltmeter from '../model/Voltmeter.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Indicator } from '../model/Indicator.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';

// Body and display area
const BODY_BOUNDS = new Bounds2( 0, 0, 172, 112 );
const X_MARGIN = 10;
const TOP_MARGIN = 10;
const BOTTOM_MARGIN = 15;
const DISPLAY_BOUNDS = new Bounds2( X_MARGIN, TOP_MARGIN, BODY_BOUNDS.width - X_MARGIN, BODY_BOUNDS.height - TOP_MARGIN - BOTTOM_MARGIN );
const CORNER_RADIUS = 10;
const NEEDLE_LENGTH = ( 0.8 * DISPLAY_BOUNDS.height );

type SelfOptions = EmptySelfOptions;

type VoltmeterNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem'>;

export default class VoltmeterNode extends Node {

  public constructor( voltmeter: Voltmeter, indicatorProperty: TReadOnlyProperty<Indicator>, providedOptions: VoltmeterNodeOptions ) {

    const bodyNode = new ShadedRectangle( BODY_BOUNDS, {
      baseColor: 'rgb( 13, 0, 160 )', //TODO color profile
      cornerRadius: CORNER_RADIUS
    } );

    const displayAreaNode = new ShadedRectangle( DISPLAY_BOUNDS, {
      baseColor: 'rgb( 255, 255, 213 )', //TODO color profile
      cornerRadius: CORNER_RADIUS
    } );

    const voltageText = new Text( FaradaysElectromagneticLabStrings.voltageStringProperty, {
      font: new PhetFont( 12 ),
      fill: 'white', // TODO color profile
      maxWidth: displayAreaNode.width,
      maxHeight: 0.85 * Math.abs( bodyNode.bottom - displayAreaNode.bottom )
    } );
    voltageText.boundsProperty.link( () => {
      voltageText.centerX = displayAreaNode.centerX;
      voltageText.centerY = displayAreaNode.bottom + ( Math.abs( displayAreaNode.bottom - bodyNode.bottom ) / 2 );
    } );

    const needleNode = new ArrowNode( 0, 0, 0, -NEEDLE_LENGTH, {
      headHeight: 15,
      headWidth: 13,
      tailWidth: 3,
      fill: 'blue', //TODO color profile,
      x: displayAreaNode.centerX,
      y: displayAreaNode.bottom - Math.abs( ( DISPLAY_BOUNDS.height - NEEDLE_LENGTH ) / 2 )
    } );

    const options = optionize<VoltmeterNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      children: [ bodyNode, displayAreaNode, voltageText, needleNode ],
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

  //TODO replace image file with code-generated icon
  public static createIcon( scale = 1 ): Node {
    return new Image( voltmeterIcon_png, {
      scale: scale
    } );
  }
}

faradaysElectromagneticLab.register( 'VoltmeterNode', VoltmeterNode );