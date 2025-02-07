// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELMovableNode is the abstract base class for rendering FELMovable, a model element with a mutable position.
 * It is responsible for pointer input, alternative input, and constrained drag bounds.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import SoundDragListener, { SoundDragListenerOptions } from '../../../../scenery-phet/js/SoundDragListener.js';
import SoundKeyboardDragListener, { SoundKeyboardDragListenerOptions } from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import InteractiveHighlighting, { InteractiveHighlightingOptions } from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

type SelfOptions = {

  // Use this option to enable or disable interaction.
  isMovable?: boolean;

  // Options passed to SoundDragListener.
  dragListenerOptions?: SoundDragListenerOptions;

  // Whether this Node has a KeyboardDragListener. Ignored if isMovable: false.
  hasKeyboardDragListener?: boolean;

  // Options passed to KeyboardDragListener. Ignored if isMovable: false.
  // This allows us to set different drag speeds for different subclasses and instances of FELMovableNode.
  // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/79.
  keyboardDragListenerOptions?: SoundKeyboardDragListenerOptions;

  // dragBoundsProperty for DragListener and KeyboardDragListener. Ignored if isMovable: false.
  dragBoundsProperty?: TReadOnlyProperty<Bounds2> | null;
};

type ParentOptions = InteractiveHighlightingOptions & NodeOptions;

export type FELMovableNodeOptions = SelfOptions &
  PickOptional<ParentOptions, 'children' | 'visibleProperty'> &
  PickRequired<ParentOptions, 'tandem'>;

export default class FELMovableNode extends InteractiveHighlighting( Node ) {

  protected constructor( positionProperty: Property<Vector2>, providedOptions: FELMovableNodeOptions ) {

    const options = optionize<FELMovableNodeOptions, SelfOptions, ParentOptions>()( {

      // SelfOptions
      isMovable: true,
      dragListenerOptions: {},
      hasKeyboardDragListener: true,
      keyboardDragListenerOptions: {
        dragSpeed: 600, // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/79
        shiftDragSpeed: 150
      },
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

    positionProperty.link( position => {
      this.translation = position;
    } );

    if ( options.isMovable ) {

      const dragListener = new SoundDragListener( combineOptions<SoundDragListenerOptions>( {
        positionProperty: positionProperty,
        dragBoundsProperty: options.dragBoundsProperty,
        useParentOffset: true,
        tandem: options.tandem.createTandem( 'dragListener' )
      }, options.dragListenerOptions ) );
      this.addInputListener( dragListener );

      if ( options.hasKeyboardDragListener ) {
        const keyboardDragListener = new SoundKeyboardDragListener(
          combineOptions<SoundKeyboardDragListenerOptions>( {
            positionProperty: positionProperty,
            dragBoundsProperty: options.dragBoundsProperty,
            tandem: options.tandem.createTandem( 'keyboardDragListener' )
          }, options.keyboardDragListenerOptions ) );
        this.addInputListener( keyboardDragListener );
      }

      // Keep the position inside of drag bounds.
      options.dragBoundsProperty && options.dragBoundsProperty.lazyLink( dragBounds => {
        if ( !isSettingPhetioStateProperty.value ) {
          if ( !dragBounds.containsPoint( positionProperty.value ) ) {
            positionProperty.value = dragBounds.closestBoundaryPointTo( positionProperty.value );
          }
        }
      } );
    }
  }
}

faradaysElectromagneticLab.register( 'FELMovableNode', FELMovableNode );