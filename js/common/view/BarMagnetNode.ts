// Copyright 2023, University of Colorado Boulder

//TODO dragBounds
//TODO collision detection - see FaradayMouseHandler.java => FELDragListener, FELKeyboardDragListener
//TODO color profile
//TODO translation of 'N' and 'S'
//TODO eliminate barMagnet_png
//TODO factor out FELDraggableNode?

/**
 * BarMagnetNode is the view of a bar magnet, with optional visualization of the field inside the magnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnet from '../model/BarMagnet.js';
import { DragListener, Image, KeyboardDragListener, KeyboardDragListenerOptions, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import barMagnet_png from '../../../images/barMagnet_png.js';
import FELConstants from '../FELConstants.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import FieldInsideNode from './FieldInsideNode.js';

type SelfOptions = {
  seeInsideProperty?: TReadOnlyProperty<boolean> | null;
};

type BarMagnetNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class BarMagnetNode extends Node {

  public constructor( barMagnet: BarMagnet, providedOptions: BarMagnetNodeOptions ) {

    const options = optionize<BarMagnetNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      seeInsideProperty: null,

      // NodeOptions
      cursor: 'pointer',
      tagName: 'div', // for KeyboardDragListener
      focusable: true, // for KeyboardDragListener
      phetioFeatured: true,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    const barMagnetImage = new Image( barMagnet_png );
    assert && assert( barMagnetImage.width === barMagnet.size.width ); //TODO
    assert && assert( barMagnetImage.height === barMagnet.size.height ); //TODO

    options.children = [ barMagnetImage ];

    super( options );

    this.addLinkedElement( barMagnet );

    barMagnet.positionProperty.link( position => {
      this.center = position;
    } );

    barMagnet.rotationProperty.link( rotation => {
      this.rotateAround( this.center, rotation - this.rotation );
    } );

    const dragListener = new DragListener( {
      positionProperty: barMagnet.positionProperty,
      useParentOffset: true,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener(
      combineOptions<KeyboardDragListenerOptions>( {}, FELConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
        positionProperty: barMagnet.positionProperty,
        tandem: options.tandem.createTandem( 'keyboardDragListener' )
      } ) );
    this.addInputListener( keyboardDragListener );

    // If seeInsideProperty was provided, then add the visualization of the field inside the bar magnet.
    if ( options.seeInsideProperty ) {
      this.addChild( new FieldInsideNode( barMagnet.strengthProperty, {
        visibleProperty: options.seeInsideProperty,
        center: barMagnetImage.center,
        tandem: options.tandem.createTandem( 'fieldInsideNode' )
      } ) );
    }
  }
}

faradaysElectromagneticLab.register( 'BarMagnetNode', BarMagnetNode );