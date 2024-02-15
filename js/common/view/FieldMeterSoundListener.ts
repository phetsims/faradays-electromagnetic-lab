// Copyright 2024, University of Colorado Boulder

//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Can this be generalized for other similar sound designs?
/**
 * FieldMeterSoundListener is responsible for sound related to the field meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { PressListenerEvent, TInputListener } from '../../../../scenery/js/imports.js';
import { Disposable, PropertyLinkListener, TReadOnlyProperty } from '../../../../axon/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import felFieldMeterLoop_mp3 from '../../../sounds/felFieldMeterLoop_mp3.js';
import Utils from '../../../../dot/js/Utils.js';
import FieldNode from './FieldNode.js';
import FadableSoundClip from './FadableSoundClip.js';

// Pitch varies over 12 semitones (1 octave), so the playback rate doubles.
const PLAYBACK_RATE_RANGE = new Range( 1, 2 );

// Output level is constant, except during fade in and fade out.
//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 This seems a little loud, 0.2 in GFLB. But then fades are inaudible.
const NORMAL_OUTPUT_LEVEL = 0.7;

export default class FieldMeterSoundListener implements TInputListener {

  private readonly soundClip: FadableSoundClip;

  private readonly fieldVectorProperty: TReadOnlyProperty<Vector2>;
  private readonly fieldMagnitudeRange: Range;
  private readonly fieldVectorListener: PropertyLinkListener<Vector2>;

  public constructor( fieldVectorProperty: TReadOnlyProperty<Vector2>, fieldMagnitudeRange: Range, fieldScaleProperty: TReadOnlyProperty<number> ) {

    this.soundClip = new FadableSoundClip( felFieldMeterLoop_mp3, {
      loop: true,
      initialOutputLevel: NORMAL_OUTPUT_LEVEL,
      deltaOutputLevel: 0.07,
      dtFadeIn: 25,
      dtFadeOut: 50
    } );
    soundManager.addSoundGenerator( this.soundClip );

    this.fieldVectorProperty = fieldVectorProperty;
    this.fieldMagnitudeRange = fieldMagnitudeRange;

    this.fieldVectorListener = fieldVector => {
      if ( fieldVector.magnitude === 0 ) {
        this.soundClip.setOutputLevel( 0 );
      }
      else {
        const playbackRate = this.fieldMagnitudeToPlaybackRate( fieldVector.magnitude, fieldScaleProperty.value );
        this.soundClip.setPlaybackRate( playbackRate );
        this.soundClip.setOutputLevel( NORMAL_OUTPUT_LEVEL );
      }
    };
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  // Plays the sound on pointer down.
  public down( event: PressListenerEvent ): void {
    this.play();
  }

  // Stops the sound on pointer up.
  public up( event: PressListenerEvent ): void {
    this.stop();
  }

  // Plays the sound when the field meter gets keyboard focus.
  public focus( event: PressListenerEvent ): void {
    this.play();
  }

  // Stops the sound when the field meter loses keyboard focus.
  public blur( event: PressListenerEvent ): void {
    this.stop();
  }

  private play(): void {
    phet.log && phet.log( 'FieldMeterSoundListener startSound' );
    this.fieldVectorProperty.link( this.fieldVectorListener );
    this.soundClip.play();
  }

  private stop(): void {
    phet.log && phet.log( 'FieldMeterSoundListener stopSound' );
    this.fieldVectorProperty.unlink( this.fieldVectorListener );
    this.soundClip.stop();
  }

  /**
   * Converts field magnitude to playback rate.
   */
  private fieldMagnitudeToPlaybackRate( fieldMagnitude: number, fieldScale: number ): number {
    assert && assert( this.fieldMagnitudeRange.contains( fieldMagnitude ), `invalid fieldMagnitude: ${fieldMagnitude}` );

    // Normalize to [0,1] with scaling.
    const normalizedMagnitude = FieldNode.normalizeMagnitude( fieldMagnitude, this.fieldMagnitudeRange.max, fieldScale );

    // Map to playback rate.
    const playbackRate = Utils.linear( 0, 1, PLAYBACK_RATE_RANGE.min, PLAYBACK_RATE_RANGE.max, normalizedMagnitude );

    assert && assert( PLAYBACK_RATE_RANGE.contains( playbackRate ), `unexpected playbackRate: ${playbackRate}` );
    return playbackRate;
  }
}

faradaysElectromagneticLab.register( 'FieldMeterSoundListener', FieldMeterSoundListener );