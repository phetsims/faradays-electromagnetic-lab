// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELMovableNode is the abstract base class for rendering FELMovable, model elements with a mutable position.
 * It is responsible for pointer input, alternative input, constrained drag bounds, and collision detection.
 * Input can be disabled via the isMovable option.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { DragListener, InteractiveHighlighting, InteractiveHighlightingOptions, KeyboardDragListener, KeyboardDragListenerOptions, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import FELMovable from '../model/FELMovable.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import grab_mp3 from '../../../../tambo/sounds/grab_mp3.js';
import release_mp3 from '../../../../tambo/sounds/release_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

type SelfOptions = {
  isMovable?: boolean; // Is this Node movable?
  hasKeyboardDragListener?: boolean;
  dragBoundsProperty?: TReadOnlyProperty<Bounds2 | null> | null;
};

type ParentOptions = InteractiveHighlightingOptions & NodeOptions;

export type FELMovableNodeOptions = SelfOptions &
  PickOptional<ParentOptions, 'children' | 'visibleProperty'> &
  PickRequired<ParentOptions, 'tandem'>;

export default class FELMovableNode extends InteractiveHighlighting( Node ) {

  public constructor( movable: FELMovable, providedOptions: FELMovableNodeOptions ) {

    const options = optionize<FELMovableNodeOptions, SelfOptions, ParentOptions>()( {

      // SelfOptions
      isMovable: true,
      hasKeyboardDragListener: true,
      dragBoundsProperty: null,

      // NodeOptions
      isDisposable: false,
      phetioFeatured: true,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    // Add options related to input listeners.
    if ( options.isMovable ) {
      options.cursor = 'pointer';
      options.phetioInputEnabledPropertyInstrumented = true;

      if ( options.hasKeyboardDragListener ) {
        options.tagName = 'div'; // for KeyboardDragListener
        options.focusable = true; // for KeyboardDragListener
      }
    }
    else {
      options.interactiveHighlightEnabled = false;
    }

    super( options );

    this.addLinkedElement( movable );

    movable.positionProperty.link( position => {
      this.translation = position;
    } );

    if ( options.isMovable ) {

      // Sounds clips associated with dragging
      const grabClip = new SoundClip( grab_mp3, FELConstants.GRAB_RELEASE_SOUND_CLIP_OPTIONS );
      const releaseClip = new SoundClip( release_mp3, FELConstants.GRAB_RELEASE_SOUND_CLIP_OPTIONS );
      soundManager.addSoundGenerator( grabClip );
      soundManager.addSoundGenerator( releaseClip );

      const dragListener = new DragListener( {
        positionProperty: movable.positionProperty,
        dragBoundsProperty: options.dragBoundsProperty,
        useParentOffset: true,
        start: () => grabClip.play(),
        end: () => releaseClip.play(),
        tandem: options.tandem.createTandem( 'dragListener' )
      } );
      this.addInputListener( dragListener );

      if ( options.hasKeyboardDragListener ) {
        const keyboardDragListener = new KeyboardDragListener(
          combineOptions<KeyboardDragListenerOptions>( {}, FELConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
            positionProperty: movable.positionProperty,
            dragBoundsProperty: options.dragBoundsProperty,
            start: () => grabClip.play(),
            end: () => releaseClip.play(),
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
}

faradaysElectromagneticLab.register( 'FELMovableNode', FELMovableNode );

