// Copyright 2023, University of Colorado Boulder

//TODO dragBounds - ala my-solar-system
//TODO collision detection - see FaradayMouseHandler.java => FELDragListener, FELKeyboardDragListener
//TODO it is odd to call this FELMovable when is can be set to isMovable:false

/**
 * FELMovableNode is the abstract base class for rendering FELMovable, model elements with a mutable position.
 * It is responsible for alternative input, constrained drag bounds, and collision detection.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { DragListener, KeyboardDragListener, KeyboardDragListenerOptions, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import FELMovable from '../model/FELMovable.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import grab_mp3 from '../../../../tambo/sounds/grab_mp3.js';
import release_mp3 from '../../../../tambo/sounds/release_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';

type SelfOptions = {
  isMovable?: boolean; // Is this Node movable?
};

export type FELMovableNodeOptions = SelfOptions &
  PickOptional<NodeOptions, 'children' | 'visibleProperty' | 'focusable'> &
  PickRequired<NodeOptions, 'tandem'>;

export default class FELMovableNode extends Node {

  public constructor( movable: FELMovable, providedOptions: FELMovableNodeOptions ) {

    const options = optionize<FELMovableNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      isMovable: true,

      // NodeOptions
      isDisposable: false,
      phetioFeatured: true,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    if ( options.isMovable ) {
      options.cursor = 'pointer';
      options.tagName = 'div'; // for KeyboardDragListener
      options.focusable = true; // for KeyboardDragListener
      options.phetioInputEnabledPropertyInstrumented = true;
    }

    super( options );

    this.addLinkedElement( movable );

    movable.positionProperty.link( position => {
      this.translation = position;
    } );

    // If this Node becomes invisible, interrupt user interaction.
    this.visibleProperty.lazyLink( visible => {
      if ( !visible ) {
        this.interruptSubtreeInput();
      }
    } );

    if ( options.isMovable ) {

      // Sounds clips associated with dragging
      const grabClip = new SoundClip( grab_mp3, FELConstants.GRAB_RELEASE_SOUND_CLIP_OPTIONS );
      const releaseClip = new SoundClip( release_mp3, FELConstants.GRAB_RELEASE_SOUND_CLIP_OPTIONS );
      soundManager.addSoundGenerator( grabClip );
      soundManager.addSoundGenerator( releaseClip );

      const dragListener = new DragListener( {
        positionProperty: movable.positionProperty,
        useParentOffset: true,
        start: () => grabClip.play(),
        end: () => releaseClip.play(),
        tandem: options.tandem.createTandem( 'dragListener' )
      } );
      this.addInputListener( dragListener );

      if ( options.focusable ) {
        const keyboardDragListener = new KeyboardDragListener(
          combineOptions<KeyboardDragListenerOptions>( {}, FELConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
            positionProperty: movable.positionProperty,
            start: () => grabClip.play(),
            end: () => releaseClip.play(),
            tandem: options.tandem.createTandem( 'keyboardDragListener' )
          } ) );
        this.addInputListener( keyboardDragListener );
      }
    }
  }
}

faradaysElectromagneticLab.register( 'FELMovableNode', FELMovableNode );

