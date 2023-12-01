// Copyright 2023, University of Colorado Boulder

/**
 * CompassNode is the visualization of a compass, whose orientation matches a magnet's B-field.
 * The origin is at the center of the compass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Compass from '../model/Compass.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Circle, Path } from '../../../../scenery/js/imports.js';
import CompassNeedleNode from './CompassNeedleNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import FELColors from '../FELColors.js';
import FELMovableNode, { FELMovableNodeOptions } from './FELMovableNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

const NEEDLE_LENGTH = 55;
const RING_LINE_WIDTH = 10;
const RING_OUTER_RADIUS = ( NEEDLE_LENGTH + 2 * RING_LINE_WIDTH + 5 ) / 2;
const NEEDLE_ANCHOR_RADIUS = 3;
const INDICATOR_SPACING = 45; // degrees
const INDICATOR_RADIUS = 3;

type SelfOptions = EmptySelfOptions;

type CompassNodeOptions = SelfOptions & StrictOmit<FELMovableNodeOptions, 'children'>;

export default class CompassNode extends FELMovableNode {

  public constructor( compass: Compass, providedOptions: CompassNodeOptions ) {

    const ringCenterRadius = RING_OUTER_RADIUS - RING_LINE_WIDTH / 2; // adjust for lineWidth

    const ringNode = new Circle( ringCenterRadius, {
      stroke: FELColors.compassRingColorProperty,
      lineWidth: RING_LINE_WIDTH,
      boundsMethod: 'accurate' // so that stroke is included TODO not working as expected
    } );

    // Indicators at evenly-spaced increments around the ring.
    let indicatorAngle = 0; // degrees
    const indicatorsShape = new Shape();
    while ( indicatorAngle < 360 ) {
      const vector = Vector2.createPolar( ringCenterRadius, Utils.toRadians( indicatorAngle ) );
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

    const options = optionize<CompassNodeOptions, SelfOptions, FELMovableNodeOptions>()( {

      // FELMovableNodeOptions
      children: [ ringNode, indicatorsNode, needleNode, needleAnchorNode ]
    }, providedOptions );

    super( compass, options );

    compass.rotationProperty.link( rotation => {
      needleNode.rotation = rotation;
      needleNode.center = ringNode.center;
    } );
  }
}

faradaysElectromagneticLab.register( 'CompassNode', CompassNode );