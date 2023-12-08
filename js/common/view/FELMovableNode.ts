// Copyright 2023, University of Colorado Boulder

//TODO dragBounds - ala my-solar-system
//TODO collision detection - see FaradayMouseHandler.java => FELDragListener, FELKeyboardDragListener

/**
 * FELMovableNode is the abstract base class for rendering FELMovable, model elements with a mutable position.
 * It is responsible for alternative input, constrained drag bounds, and collision detection.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { DragListener, KeyboardDragListener, KeyboardDragListenerOptions, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import FELMovable from '../model/FELMovable.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

export type FELMovableNodeOptions = SelfOptions &
  PickOptional<NodeOptions, 'visibleProperty' | 'focusable'> &
  PickRequired<NodeOptions, 'children' | 'tandem'>;

export default abstract class FELMovableNode extends Node {

  protected constructor( movable: FELMovable, providedOptions: FELMovableNodeOptions ) {

    const options = optionize<FELMovableNodeOptions, SelfOptions, NodeOptions>()( {
      isDisposable: false,
      cursor: 'pointer',
      tagName: 'div', // for KeyboardDragListener
      focusable: true, // for KeyboardDragListener
      phetioFeatured: true,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    this.addLinkedElement( movable );

    movable.positionProperty.link( position => {
      this.translation = position;
    } );

    const dragListener = new DragListener( {
      positionProperty: movable.positionProperty,
      useParentOffset: true,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    if ( options.focusable ) {
      const keyboardDragListener = new KeyboardDragListener(
        combineOptions<KeyboardDragListenerOptions>( {}, FELConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
          positionProperty: movable.positionProperty,
          tandem: options.tandem.createTandem( 'keyboardDragListener' )
        } ) );
      this.addInputListener( keyboardDragListener );
    }

    // If this Node becomes invisible, interrupt user interaction.
    this.visibleProperty.lazyLink( visible => {
      if ( !visible ) {
        this.interruptSubtreeInput();
      }
    } );
  }
}

faradaysElectromagneticLab.register( 'FELMovableNode', FELMovableNode );

