// Copyright 2023, University of Colorado Boulder

//TODO dragBounds
//TODO collision detection
//TODO color profile

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
import { Circle, Color, DragListener, KeyboardDragListener, KeyboardDragListenerOptions, Node, Path } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import CompassNeedleNode from './CompassNeedleNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';

const RING_RADIUS = 40;
const RING_LINE_WIDTH = 10;
const NEEDLE_LENGTH = 55;
const NEEDLE_ANCHOR_RADIUS = 3;
const INDICATOR_SPACING = 45; // degrees
const INDICATOR_RADIUS = 3;

export default class CompassNode extends Node {

  public constructor( compass: Compass, visibleProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) {

    const ringNode = new Circle( RING_RADIUS, {
      stroke: Color.grayColor( 153 ),
      lineWidth: RING_LINE_WIDTH,
      boundsMethod: 'accurate' // so that stroke is included TODO not working as expected
    } );

    // Indicators at evenly-spaced increments around the ring.
    let indicatorAngle = 0; // degrees
    const indicatorsShape = new Shape();
    while ( indicatorAngle < 360 ) {
      const vector = Vector2.createPolar( RING_RADIUS, Utils.toRadians( indicatorAngle ) );
      indicatorsShape.circle( vector, INDICATOR_RADIUS );
      indicatorAngle += INDICATOR_SPACING;
    }
    const indicatorsNode = new Path( indicatorsShape, {
      fill: 'black'
    } );

    const needleNode = new CompassNeedleNode( NEEDLE_LENGTH );
    needleNode.center = ringNode.center;

    const needleAnchorNode = new Circle( NEEDLE_ANCHOR_RADIUS, {
      fill: 'black',
      center: ringNode.center
    } );

    super( {
      children: [ ringNode, indicatorsNode, needleNode, needleAnchorNode ],
      cursor: 'pointer',
      visibleProperty: visibleProperty,
      tagName: 'div', // for KeyboardDragListener
      focusable: true, // for KeyboardDragListener
      tandem: tandem
    } );

    compass.positionProperty.link( position => {
      this.center = position;
    } );

    //TODO not working as expected with KinematicCompass
    compass.rotationProperty.link( rotation => needleNode.rotateAround( needleNode.center, rotation ) );

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