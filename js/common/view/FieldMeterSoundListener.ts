// Copyright 2023-2024, University of Colorado Boulder

//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Can this be generalized for other similar sound designs?
//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Should fades be logarithmic?
/**
 * FieldMeterSoundListener is responsible for sound related to the field meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { PressListenerEvent, TInputListener } from '../../../../scenery/js/imports.js';
import { Disposable, PropertyLinkListener, stepTimer, TimerListener, TReadOnlyProperty } from '../../../../axon/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import felFieldMeterLoop_mp3 from '../../../sounds/felFieldMeterLoop_mp3.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import Utils from '../../../../dot/js/Utils.js';
import FieldNode from './FieldNode.js';

// Pitch varies over 12 semitones (1 octave), so the playback rate doubles.
const PLAYBACK_RATE_RANGE = new Range( 1, 2 );

// Output level is constant, except during fade in and fade out.
//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 This seems a little loud, 0.2 in GFLB. But then fades are inaudible.
const NORMAL_OUTPUT_LEVEL = 0.7;

// Fade parameters
const FADE_OUTPUT_LEVEL_DELTA = NORMAL_OUTPUT_LEVEL / 10;
const FADE_STEPS = PLAYBACK_RATE_RANGE.getLength() / FADE_OUTPUT_LEVEL_DELTA;
const FADE_IN_INTERVAL = 250; // time over which fade out occurs, in ms
const FADE_OUT_INTERVAL = 500; // time over which fade out occurs, in ms

export default class FieldMeterSoundListener implements TInputListener {

  private readonly soundClip: SoundClip;

  private readonly fieldVectorProperty: TReadOnlyProperty<Vector2>;
  private readonly fieldMagnitudeRange: Range;
  private readonly fieldVectorListener: PropertyLinkListener<Vector2>;

  private stepTimerListener: TimerListener | null;
  private readonly fadeInCallback: () => void;
  private readonly fadeOutCallback: () => void;

  public constructor( fieldVectorProperty: TReadOnlyProperty<Vector2>, fieldMagnitudeRange: Range, fieldScaleProperty: TReadOnlyProperty<number> ) {

    this.soundClip = new SoundClip( felFieldMeterLoop_mp3, {
      initialOutputLevel: NORMAL_OUTPUT_LEVEL,
      loop: true
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

    this.stepTimerListener = null;

    // Fades in the sound by increasing its output level over time, until it reaches the normal output level.
    this.fadeInCallback = () => {
      assert && assert( this.stepTimerListener, 'expected stepTimerListener to be set' );
      const outputLevel = Math.min( NORMAL_OUTPUT_LEVEL, this.soundClip.outputLevel + FADE_OUTPUT_LEVEL_DELTA );
      this.soundClip.setOutputLevel( outputLevel );
      if ( outputLevel === NORMAL_OUTPUT_LEVEL ) {
        stepTimer.clearInterval( this.stepTimerListener! );
        this.stepTimerListener = null;
      }
    };

    // Fades out the sound by reducing the output level over time, until it reaches 0.
    this.fadeOutCallback = () => {
      assert && assert( this.stepTimerListener, 'expected stepTimerListener to be set' );
      const outputLevel = Math.max( 0, this.soundClip.outputLevel - FADE_OUTPUT_LEVEL_DELTA );
      this.soundClip.setOutputLevel( outputLevel );
      if ( outputLevel === 0 ) {
        this.soundClip.stop();
        stepTimer.clearInterval( this.stepTimerListener! );
        this.stepTimerListener = null;
      }
    };
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  // Starts the sound when the field meter on pointer down.
  public down( event: PressListenerEvent ): void {
    this.startSound();
  }

  // Stops the sound when the field meter on pointer up.
  public up( event: PressListenerEvent ): void {
    this.stopSound();
  }

  // Starts the sound when the field meter gets keyboard focus.
  public focus( event: PressListenerEvent ): void {
    this.startSound();
  }

  // Stops the sound when the field meter loses keyboard focus.
  public blur( event: PressListenerEvent ): void {
    this.stopSound();
  }

  // Starts the sound, with fade in.
  private startSound(): void {
    assert && assert( !this.soundClip.isPlaying );

    phet.log && phet.log( 'FieldMeterSoundListener startSound' );

    // Listen to changes in fieldVectorProperty
    this.fieldVectorProperty.link( this.fieldVectorListener );

    // Clear a fade that was in progress.
    if ( this.stepTimerListener ) {
      stepTimer.clearInterval( this.stepTimerListener );
    }

    // Fade in.
    this.soundClip.setOutputLevel( 0 );
    this.soundClip.play();
    if ( this.fieldVectorProperty.value.magnitude > 0 ) {
      this.stepTimerListener = stepTimer.setInterval( this.fadeInCallback, FADE_IN_INTERVAL / FADE_STEPS );
    }
  }

  // Stops the sound, with fade out.
  private stopSound(): void {
    assert && assert( this.soundClip.isPlaying );

    phet.log && phet.log( 'FieldMeterSoundListener stopSound' );

    // Stop listening to fieldVectorProperty
    this.fieldVectorProperty.unlink( this.fieldVectorListener );

    // Clear a fade that was in progress.
    if ( this.stepTimerListener ) {
      stepTimer.clearInterval( this.stepTimerListener );
    }

    // Fade out.
    this.stepTimerListener = stepTimer.setInterval( this.fadeOutCallback, FADE_OUT_INTERVAL / FADE_STEPS );
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