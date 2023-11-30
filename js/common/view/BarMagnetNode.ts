// Copyright 2023, University of Colorado Boulder

//TODO dragBounds
//TODO collision detection
//TODO color profile
//TODO translation of 'N' and 'S'
//TODO eliminate barMagnet_png

/**
 * BarMagnetNode is the view of a BarMagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnet from '../model/BarMagnet.js';
import { DragListener, Image, KeyboardDragListener, KeyboardDragListenerOptions, Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import barMagnet_png from '../../../images/barMagnet_png.js';
import FELConstants from '../FELConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

export default class BarMagnetNode extends Node {

  public constructor( barMagnet: BarMagnet, tandem: Tandem ) {

    const barMagnetImage = new Image( barMagnet_png );
    assert && assert( barMagnetImage.width === barMagnet.size.width ); //TODO
    assert && assert( barMagnetImage.height === barMagnet.size.height ); //TODO

    super( {
      children: [ barMagnetImage ],
      cursor: 'pointer',
      tagName: 'div', // for KeyboardDragListener
      focusable: true, // for KeyboardDragListener
      tandem: tandem
    } );

    barMagnet.positionProperty.link( position => {
      this.center = position;
    } );

    barMagnet.rotationProperty.link( rotation => {
      this.rotateAround( this.center, rotation - this.rotation );
    } );

    const dragListener = new DragListener( {
      positionProperty: barMagnet.positionProperty,
      useParentOffset: true,
      tandem: tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener(
      combineOptions<KeyboardDragListenerOptions>( {}, FELConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
        positionProperty: barMagnet.positionProperty,
        tandem: tandem.createTandem( 'keyboardDragListener' )
      } ) );
    this.addInputListener( keyboardDragListener );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetNode', BarMagnetNode );