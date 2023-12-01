// Copyright 2023, University of Colorado Boulder

//TODO dragBounds
//TODO collision detection - see FaradayMouseHandler.java => FELDragListener, FELKeyboardDragListener

/**
 * CompassNode is the visualization of a compass, whose orientation matches a magnet's B-field.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Compass from '../model/Compass.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Circle, DragListener, KeyboardDragListener, KeyboardDragListenerOptions, Node, Path } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import CompassNeedleNode from './CompassNeedleNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import FELColors from '../FELColors.js';

const NEEDLE_LENGTH = 55;
const RING_LINE_WIDTH = 10;
const RING_OUTER_RADIUS = ( NEEDLE_LENGTH + 2 * RING_LINE_WIDTH + 5 ) / 2;
const NEEDLE_ANCHOR_RADIUS = 3;
const INDICATOR_SPACING = 45; // degrees
const INDICATOR_RADIUS = 3;

export default class CompassNode extends Node {

  public constructor( compass: Compass, visibleProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) {

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

    super( {
      children: [ ringNode, indicatorsNode, needleNode, needleAnchorNode ],
      cursor: 'pointer',
      visibleProperty: visibleProperty,
      tagName: 'div', // for KeyboardDragListener
      focusable: true, // for KeyboardDragListener
      tandem: tandem,
      phetioFeatured: true,
      phetioInputEnabledPropertyInstrumented: true
    } );

    this.addLinkedElement( compass );

    compass.positionProperty.link( position => {
      this.center = position;
    } );

    compass.rotationProperty.link( rotation => {
      needleNode.rotation = rotation;
      needleNode.center = ringNode.center;
    } );

    const dragListener = new DragListener( {
      positionProperty: compass.positionProperty,
      useParentOffset: true,
      tandem: tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener(
      combineOptions<KeyboardDragListenerOptions>( {}, FELConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
        positionProperty: compass.positionProperty,
        tandem: tandem.createTandem( 'keyboardDragListener' )
      } ) );
    this.addInputListener( keyboardDragListener );
  }
}

faradaysElectromagneticLab.register( 'CompassNode', CompassNode );