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
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';

// Pitch varies over 12 semitones (1 octave), so the playback rate doubles.
const PLAYBACK_RATE_RANGE = new Range( 1, 2 );

// Output level is constant, except during fades, or when field magnitude is zero,
const MAX_OUTPUT_LEVEL = 0.7;

// Fade times, in seconds
const FADE_IN_TIME = 0.25;
const FADE_OUT_TIME = 0.25;

export default class FieldMeterSoundListener implements TInputListener {

  // Pitch of soundClip is modulated to match field magnitude. The clip plays continuously during a drag cycle.
  private readonly soundClip: SoundClip;

  // fieldVectorProperty is observed by fieldVectorListener while a drag cycle is in progress.
  private readonly fieldVectorProperty: TReadOnlyProperty<Vector2>;
  private readonly fieldMagnitudeRange: Range;
  private readonly fieldVectorListener: PropertyLinkListener<Vector2>;

  public constructor( fieldVectorProperty: TReadOnlyProperty<Vector2>, fieldMagnitudeRange: Range, fieldScaleProperty: TReadOnlyProperty<number> ) {

    this.soundClip = new SoundClip( felFieldMeterLoop_mp3, {
      loop: true,
      initialOutputLevel: 0
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
        if ( this.soundClip.isPlaying && this.soundClip.outputLevel === 0 ) {
          this.soundClip.setOutputLevel( MAX_OUTPUT_LEVEL );
        }
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

    // Start observing fieldVectorProperty.
    if ( !this.fieldVectorProperty.hasListener( this.fieldVectorListener ) ) {
      this.fieldVectorProperty.link( this.fieldVectorListener );
    }

    // Start playing the sound clip.
    this.soundClip.play();

    // Fade in.
    const outputLevel = ( this.fieldVectorProperty.value.magnitude === 0 ) ? 0 : MAX_OUTPUT_LEVEL;
    this.soundClip.setOutputLevel( outputLevel, secondsToTimeConstant( FADE_IN_TIME ) );
  }

  private stop(): void {

    // Stop observing fieldVectorProperty.
    if ( this.fieldVectorProperty.hasListener( this.fieldVectorListener ) ) {
      this.fieldVectorProperty.unlink( this.fieldVectorListener );
    }

    // Fade out.
    this.soundClip.setOutputLevel( 0, secondsToTimeConstant( FADE_OUT_TIME ) );

    // Stop when the fade has completed.
    this.soundClip.stop( FADE_OUT_TIME );
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

/**
 * SoundClip.setOutputLevel uses WebAudio setTargetAtTime to set output level, with optional fade. The timeConstant
 * argument to setTargetAtTime is NOT the fade time, it's an exponential approach to the target output level.
 * Doc for setTargetAtTime at https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime#timeconstant
 * says: "Depending on your use case, getting 95% toward the target value may already be enough; in that case, you
 * could set timeConstant to one third of the desired duration."  So that's the basis for this implementation.
 */
function secondsToTimeConstant( seconds: number ): number {
  return seconds / 3;
}

faradaysElectromagneticLab.register( 'FieldMeterSoundListener', FieldMeterSoundListener );