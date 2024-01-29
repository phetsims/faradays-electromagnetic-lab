// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELMovableNode is the abstract base class for rendering FELMovable, a model element with a mutable position.
 * It is responsible for pointer input, alternative input, and constrained drag bounds.
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
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = {

  // Use this option to enable or disable interaction.
  isMovable?: boolean;

  // Whether this Node has a KeyboardDragListener. Ignored if isMovable: false.
  hasKeyboardDragListener?: boolean;

  // Options passed to KeyboardDragListener. Ignored if isMovable: false.
  // This allows us to set different drag speeds for different subclasses and instances of FELMovableNode.
  // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/54.
  keyboardDragListenerOptions?: PickOptional<KeyboardDragListenerOptions, 'dragSpeed' | 'shiftDragSpeed'>;

  // dragBoundsProperty for DragListener and KeyboardDragListener. Ignored if Ignored if isMovable: false.
  dragBoundsProperty?: TReadOnlyProperty<Bounds2> | null;
};

type ParentOptions = InteractiveHighlightingOptions & NodeOptions;

export type FELMovableNodeOptions = SelfOptions &
  PickOptional<ParentOptions, 'children' | 'visibleProperty'> &
  PickRequired<ParentOptions, 'tandem'>;

export default class FELMovableNode extends InteractiveHighlighting( Node ) {

  protected constructor( movable: FELMovable, providedOptions: FELMovableNodeOptions ) {

    const options = optionize<FELMovableNodeOptions, StrictOmit<SelfOptions, 'keyboardDragListenerOptions'>, ParentOptions>()( {

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
          }, options.keyboardDragListenerOptions ) );
        this.addInputListener( keyboardDragListener );
      }

      // Interrupt interaction when this Node becomes invisible.
      this.visibleProperty.lazyLink( visible => !visible && this.interruptSubtreeInput() );
    }
  }
}

faradaysElectromagneticLab.register( 'FELMovableNode', FELMovableNode );

