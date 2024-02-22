// Copyright 2024, University of Colorado Boulder

/**
 * FieldMeterSonifier is responsible for sonification of a FieldMeterNode view element.
 *
 * The magnitude of the magnetic field at the meter's position is used to modulate the pitch of a sound clip,
 * with a constant output level. During the drag cycle of the field meter, there are 2 types of behavior that
 * are controlled by TIMEOUT:
 *
 * (1) With TIMEOUT === Infinity, the sound plays continuously throughout the drag cycle.
 * (2) With TIMEOUT !== Infinity, the sound plays while the field magnitude is changing, then fades out when it
 *     has not changed for TIMEOUT milliseconds.
 *
 * See https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 for design history.
 *
 * TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Next steps:
 * (1) Decide whether to use behavior (1) or (2) above. I recommend (2) because it is more consistent with other
 * PhET sims (e.g. Gravity Force Lab: Basics) and it provides a significantly better UX for alternative input.
 * (2) Also decide which of the fieldMagnitudeToPlaybackRate* methods to keep, and delete the others.
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
import Utils from '../../../../dot/js/Utils.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import FieldNode from './FieldNode.js';
import FELQueryParameters from '../FELQueryParameters.js';
import FELUtils from '../FELUtils.js';

// Pitch varies by 12 semitones. There are 12 semitones per octave.
const SEMITONES = 12;
const MIN_PLAYBACK_RATE = 1;
const PLAYBACK_RATE_RANGE = new Range( MIN_PLAYBACK_RATE, MIN_PLAYBACK_RATE + SEMITONES / 12 );

// Output level is constant, except during fades, or when field magnitude is zero.
const MAX_OUTPUT_LEVEL = 0.2;

// Fade times, in seconds.
const FADE_IN_TIME = 0.25;
const FADE_OUT_TIME = 0.25;

// If the field vector does not change in this amount of time (in ms), sound will fade out and stop.
// Infinity means that the sound plays continuously during the drag cycle.
const TIMEOUT = 250;

export default class FieldMeterSonifier implements TInputListener {

  // Pitch of soundClip is modulated to match field magnitude. The clip plays continuously during a drag cycle.
  private readonly soundClip: SoundClip;

  // fieldVectorProperty is observed by fieldVectorListener while a drag cycle is in progress.
  private readonly fieldVectorProperty: TReadOnlyProperty<Vector2>;
  private readonly fieldVectorListener: PropertyLinkListener<Vector2>;

  // Called if fieldVectorProperty has not changed for TIMEOUT seconds.
  private timeoutCallback: TimerListener | null;

  public constructor( fieldVectorProperty: TReadOnlyProperty<Vector2>, fieldMagnitudeRange: Range ) {

    this.soundClip = new SoundClip( felFieldMeterLoop_mp3, {
      loop: true,
      initialOutputLevel: 0
    } );
    soundManager.addSoundGenerator( this.soundClip );

    this.fieldVectorProperty = fieldVectorProperty;

    this.timeoutCallback = null;

    this.fieldVectorListener = fieldVector => {

      // If fieldVectorProperty changes before the timeout, clear the timeout.
      this.clearTimeout();

      if ( fieldVector.magnitude === 0 ) {
        this.stop();
      }
      else {

        // If the clip is not playing, start it playing.
        !this.isPlaying && this.play();

        // Map field magnitude to playback rate.
        const playbackRate = FieldMeterSonifier.fieldMagnitudeToPlaybackRatePiecewiseLinear( fieldVector.magnitude, fieldMagnitudeRange );
        assert && assert( PLAYBACK_RATE_RANGE.contains( playbackRate ), `invalid playbackRate: ${playbackRate}` );
        this.soundClip.setPlaybackRate( playbackRate );

        // Schedule a timer to stop sound if fieldVectorProperty does not change TIMEOUT seconds from now.
        if ( TIMEOUT !== Infinity ) {
          this.timeoutCallback = stepTimer.setTimeout( () => {
            this.timeoutCallback = null; // setTimeOut removes timeoutCallback
            this.stop();
          }, TIMEOUT );
        }
      }
    };
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  // Interaction started using the pointer.
  public down( event: PressListenerEvent ): void {
    this.beginInteraction();
  }

  // Interaction ended using the pointer.
  public up( event: PressListenerEvent ): void {
    this.endInteraction();
  }

  // Interaction started using the keyboard.
  public focus( event: PressListenerEvent ): void {
    this.beginInteraction();
  }

  // Interaction ended using the keyboard.
  public blur( event: PressListenerEvent ): void {
    this.endInteraction();
  }

  private beginInteraction(): void {

    // Start observing fieldVectorProperty - note lazyLink!
    if ( !this.fieldVectorProperty.hasListener( this.fieldVectorListener ) ) {
      this.fieldVectorProperty.lazyLink( this.fieldVectorListener );
    }

    // If the sound is continuous, start it playing.
    if ( TIMEOUT === Infinity ) {
      this.play();
    }
  }

  private endInteraction(): void {

    // Stop observing fieldVectorProperty.
    if ( this.fieldVectorProperty.hasListener( this.fieldVectorListener ) ) {
      this.fieldVectorProperty.unlink( this.fieldVectorListener );
    }

    // Stop the sound.
    this.stop();
  }

  private play(): void {

    if ( this.fieldVectorProperty.value.magnitude > 0 ) {

      // Start playing the sound clip.
      this.soundClip.play();

      // Fade in.
      this.soundClip.setOutputLevel( MAX_OUTPUT_LEVEL, FELUtils.secondsToTimeConstant( FADE_IN_TIME ) );
    }
  }

  private stop(): void {

    // If stopped by the timer, clear it.
    this.clearTimeout();

    // Fade out.
    this.soundClip.setOutputLevel( 0, FELUtils.secondsToTimeConstant( FADE_OUT_TIME ) );

    // Stop when the fade has completed.
    this.soundClip.stop( FADE_OUT_TIME );
  }

  private clearTimeout(): void {
    if ( this.timeoutCallback ) {
      stepTimer.clearTimeout( this.timeoutCallback );
      this.timeoutCallback = null;
    }
  }

  private get isPlaying(): boolean {
    return this.soundClip.isPlaying;
  }

  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 This mapping was our best attempt so far, see notes in the GitHub issue.
  /**
   * Converts B-field magnitude to playback rate using a piecewise linear interpolation, where the range is divided
   * into 2 separate linear mappings. It provides discernible changes in pitch at for these pedagogically important
   * interactions:
   *
   * - Big discontinuity in pitch when entering/leaving the magnet from the top/bottom edges.
   * - No discontinuity in pitch when entering/leaving the magnet at the poles.
   * - A noticeable difference in pitch in a roughly circular area near the poles.
   * - Fast drop-off as distance from the magnet increases, with little/no discernible pitch difference in places
   *   that are "far" from the magnet.
   */
  public static fieldMagnitudeToPlaybackRatePiecewiseLinear( fieldMagnitude: number, fieldMagnitudeRange: Range ): number {
    assert && assert( fieldMagnitudeRange.contains( fieldMagnitude ), `invalid fieldMagnitude: ${fieldMagnitude}` );

    const piecewiseCutoff = FELQueryParameters.piecewiseCutoff; // G
    assert && assert( fieldMagnitudeRange.contains( piecewiseCutoff ), `invalid piecewiseCutoff: ${piecewiseCutoff}` );

    let playbackRate: number;
    if ( fieldMagnitude < piecewiseCutoff ) {
      playbackRate = Utils.linear( fieldMagnitudeRange.min, piecewiseCutoff,
        PLAYBACK_RATE_RANGE.min, PLAYBACK_RATE_RANGE.getCenter(),
        fieldMagnitude );
    }
    else {
      playbackRate = Utils.linear( piecewiseCutoff, fieldMagnitudeRange.max,
        PLAYBACK_RATE_RANGE.getCenter(), PLAYBACK_RATE_RANGE.max,
        fieldMagnitude );
    }

    assert && assert( PLAYBACK_RATE_RANGE.contains( playbackRate ), `unexpected playbackRate: ${playbackRate}` );
    return playbackRate;
  }

  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Delete if not used. This mapping had problems, see notes in the GitHub issue.
  /**
   * Converts B-field magnitude to playback rate. This uses the same scaling algorithm that is used for scaling
   * the visualization of the B-field.
   */
  public static fieldMagnitudeToPlaybackRateScaled( fieldMagnitude: number, fieldMagnitudeRange: Range ): number {
    assert && assert( fieldMagnitudeRange.contains( fieldMagnitude ), `invalid fieldMagnitude: ${fieldMagnitude}` );

    // We're using FieldNode.normalizeMagnitude, the same mapping used for the B-field visualization. That visualization
    // uses Magnet.fieldScaleProperty whose default value is 2.7.  We did not use Magnet.fieldScaleProperty here because
    // we need independent control for auditory scaling.
    const FIELD_SCALE = 2.7;

    // Normalize to [0,1] with scaling.
    const normalizedMagnitude = FieldNode.normalizeMagnitude( fieldMagnitude, fieldMagnitudeRange.max, FIELD_SCALE );

    // Map to playback rate.
    const playbackRate = Utils.linear( 0, 1, PLAYBACK_RATE_RANGE.min, PLAYBACK_RATE_RANGE.max, normalizedMagnitude );

    assert && assert( PLAYBACK_RATE_RANGE.contains( playbackRate ), `unexpected playbackRate: ${playbackRate}` );
    return playbackRate;
  }

  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Delete this, when no longer need to demonstrate.
  /**
   * Converts B-field magnitude to playback rate using a linear interpolation. This mapping is to demonstrate that
   * a linear mapping is not appropriate, because of how the B-field behaves. With a linear mapping, there will be
   * no discernible change in pitch outside the magnet.
   */
  public static fieldMagnitudeToPlaybackRateLinear( fieldMagnitude: number, fieldMagnitudeRange: Range ): number {
    assert && assert( fieldMagnitudeRange.contains( fieldMagnitude ), `invalid fieldMagnitude: ${fieldMagnitude}` );

    const playbackRate = Utils.linear( fieldMagnitudeRange.min, fieldMagnitudeRange.max,
      PLAYBACK_RATE_RANGE.min, PLAYBACK_RATE_RANGE.max,
      fieldMagnitude );

    assert && assert( PLAYBACK_RATE_RANGE.contains( playbackRate ), `unexpected playbackRate: ${playbackRate}` );
    return playbackRate;
  }
}

faradaysElectromagneticLab.register( 'FieldMeterSonifier', FieldMeterSonifier );