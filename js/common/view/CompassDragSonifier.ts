// Copyright 2024, University of Colorado Boulder

/**
 * CompassDragSonifier is responsible for sonification of a CompassNode view element while it is being dragged.
 *
 * The compass needle angle is used to modulate the pitch of a sound clip, with a constant output level. Sound plays
 * whenever the compass is visible and the needle angle is changing. Sound plays while the user is interacting with 
 * the compass.
 *
 * See https://github.com/phetsims/faradays-electromagnetic-lab/issues/78 for design history.
 *
 * TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/78 Next steps:
 * (1) Decide whether to use CompassDragSonifier (view) or CompassSonifier (model). If CompassDragSonifier,
 *     then add to CompassNode like this: this.addInputListener( new CompassDragSonifier( compass ) );
 * (2) Decide whether to use timeout: Infinity to effectively disable the timeout during dragging
 * (3) Decide which of the needleAngleToPlaybackRate* methods to keep, and delete the others.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import { PressListenerEvent, TInputListener } from '../../../../scenery/js/imports.js';
import felCompassSaturatedSineLoop_mp3 from '../../../sounds/felCompassSaturatedSineLoop_mp3.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Compass from '../model/Compass.js';
import CompassSonifier from '../model/CompassSonifier.js';
import FELSonifier from '../model/FELSonifier.js';

export default class CompassDragSonifier extends FELSonifier implements TInputListener {

  private readonly isInteractingProperty: Property<boolean>;

  public constructor( compass: Compass ) {

    const playbackRateProperty = new DerivedProperty( [ compass.needleAngleProperty ],
      needleAngle => CompassSonifier.needleAngleToPlaybackRateMirror( needleAngle ) );

    const isInteractingProperty = new BooleanProperty( false );

    super( playbackRateProperty, {
      isDisposable: false,
      wrappedAudioBuffer: felCompassSaturatedSineLoop_mp3,
      maxOutputLevel: 0.2,
      enabledProperty: DerivedProperty.and( [ isInteractingProperty, compass.visibleProperty ] )
    } );

    this.isInteractingProperty = isInteractingProperty;
  }

  // Interaction started using the pointer.
  public down( event: PressListenerEvent ): void {
    this.isInteractingProperty.value = true;
  }

  // Interaction ended using the pointer.
  public up( event: PressListenerEvent ): void {
    this.isInteractingProperty.value = false;
  }

  // Interaction started using the keyboard.
  public focus( event: PressListenerEvent ): void {
    this.isInteractingProperty.value = true;
  }

  // Interaction ended using the keyboard.
  public blur( event: PressListenerEvent ): void {
    this.isInteractingProperty.value = false;
  }
}

faradaysElectromagneticLab.register( 'CompassDragSonifier', CompassDragSonifier );