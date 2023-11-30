// Copyright 2023, University of Colorado Boulder

/**
 * CompassNode is the visualization of a compass, whose orientation matches a magnet's B-field.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Compass from '../model/Compass.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Circle, DragListener, KeyboardDragListener, KeyboardDragListenerOptions, Node } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';

export default class CompassNode extends Node {

  public constructor( compass: Compass, visibleProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) {

    const bodyNode = new Circle( 40, {
      fill: 'white',
      stroke: 'black'
    } );

    super( {
      children: [ bodyNode ],
      cursor: 'pointer',
      visibleProperty: visibleProperty,
      tagName: 'div', // for KeyboardDragListener
      focusable: true, // for KeyboardDragListener
      tandem: tandem
    } );

    compass.positionProperty.link( position => {
      this.center = position;
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