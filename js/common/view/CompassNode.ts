// Copyright 2023, University of Colorado Boulder

/**
 * CompassNode is the visualization of a compass, whose orientation matches a magnet's B-field at the compass' position.
 * The origin is at the center of the compass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Compass from '../model/Compass.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Circle, Node, Path } from '../../../../scenery/js/imports.js';
import CompassNeedleNode from './CompassNeedleNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import FELColors from '../FELColors.js';
import FELMovableNode, { FELMovableNodeOptions } from './FELMovableNode.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const NEEDLE_LENGTH = 55;
const NEEDLE_ANCHOR_RADIUS = 3;
const RING_LINE_WIDTH = 10;
const RING_OUTER_RADIUS = ( NEEDLE_LENGTH + ( 2 * RING_LINE_WIDTH ) + 5 ) / 2;
const RING_CENTER_RADIUS = RING_OUTER_RADIUS - ( RING_LINE_WIDTH / 2 ); // adjust for lineWidth
const INDICATOR_RADIUS = 3;
const INDICATOR_SPACING = Utils.toRadians( 45 );

export default class CompassNode extends FELMovableNode {

  public constructor( compass: Compass, tandem: Tandem ) {

    const ringNode = new Circle( RING_CENTER_RADIUS, {
      stroke: FELColors.compassRingColorProperty,
      lineWidth: RING_LINE_WIDTH
    } );

    // Indicators at evenly-spaced increments around the ring.
    let indicatorAngle = 0; // radians
    const indicatorsShape = new Shape();
    while ( indicatorAngle < 360 ) {
      const vector = Vector2.createPolar( RING_CENTER_RADIUS, indicatorAngle );
      indicatorsShape.circle( vector, INDICATOR_RADIUS );
      indicatorAngle += INDICATOR_SPACING;
    }
    const indicatorsNode = new Path( indicatorsShape, {
      fill: FELColors.compassIndicatorsColorProperty
    } );

    const needleNode = new CompassNeedleNode( NEEDLE_LENGTH );

    const needleAnchorNode = new Circle( NEEDLE_ANCHOR_RADIUS, {
      fill: FELColors.compassNeedleAnchorColorProperty,
      center: ringNode.center
    } );

    const notPickableNodes = new Node( {
      children: [ ringNode, indicatorsNode, needleNode, needleAnchorNode ],
      pickable: false
    } );

    // ... so this Node can be grabbed by the circular shape that matches ringNode.
    const dragPath = new Path( Shape.circle( RING_OUTER_RADIUS ), {
      fill: 'transparent',
      stroke: 'transparent',
      center: ringNode.center
    } );

    const options = combineOptions<FELMovableNodeOptions>( {
      children: [ notPickableNodes, dragPath ],
      visibleProperty: compass.visibleProperty,
      tandem: tandem
    } );

    super( compass, options );

    compass.rotationProperty.link( rotation => {
      needleNode.rotation = rotation;
      needleNode.center = ringNode.center;
    } );
  }
}

faradaysElectromagneticLab.register( 'CompassNode', CompassNode );