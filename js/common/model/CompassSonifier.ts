// Copyright 2024, University of Colorado Boulder

/**
 * CompassSonifier is responsible for sonification of a Compass model element.
 *
 * The compass needle angle is used to modulate the pitch of a sound clip, with a constant output level. Sound plays
 * whenever the compass is visible and the needle angle is changing. Sound stops playing when the needle angle
 * comes to reset for some time interval.
 *
 * See https://github.com/phetsims/faradays-electromagnetic-lab/issues/78 for design history.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Disposable, stepTimer, TimerListener } from '../../../../axon/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Utils from '../../../../dot/js/Utils.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import felCompassSaturatedSineLoop_mp3 from '../../../sounds/felCompassSaturatedSineLoop_mp3.js';
import FELUtils from '../FELUtils.js';
import Compass from './Compass.js';
import isResettingAllProperty from '../isResettingAllProperty.js';

// Pitch varies by 10 semitones. There are 12 semitones per octave.
const SEMITONES = 10;
const MIN_PLAYBACK_RATE = 1;
const PLAYBACK_RATE_RANGE = new Range( MIN_PLAYBACK_RATE, MIN_PLAYBACK_RATE + SEMITONES / 12 );

// Output level is constant, except during fades, or when field magnitude is zero.
const MAX_OUTPUT_LEVEL = 0.2;

// If the compass is at reset this long (in ms), sound will fade out and stop.
const TIMEOUT = 500;

// Fade times, in seconds.
const FADE_IN_TIME = 0.25;
const FADE_OUT_TIME = 0.25;

export default class CompassSonifier {

  // Pitch of soundClip is modulated by the needle angle, output level is constant.
  private readonly soundClip: SoundClip;

  // Called if the needle angle has not changed for TIMEOUT seconds.
  private timeoutCallback: TimerListener | null;

  public constructor( compass: Compass ) {

    this.soundClip = new SoundClip( felCompassSaturatedSineLoop_mp3, {
      loop: true,
      initialOutputLevel: MAX_OUTPUT_LEVEL
    } );
    soundManager.addSoundGenerator( this.soundClip );

    this.timeoutCallback = null;

    // Map needle angle to playback rate.
    compass.needleAngleProperty.lazyLink( needleAngle => {
      if ( compass.visibleProperty.value ) {

        // If the angle changed before the timeout, clear the timeout.
        this.clearTimeout();

        // If the clip is not playing, start it playing.
        !this.isPlaying && this.play();

        // Map angle to playback rate.
        const playbackRate = CompassSonifier.needleAngleToPlaybackRateMirror( needleAngle );
        this.soundClip.setPlaybackRate( playbackRate );

        // Schedule a timer to stop sound if needleAngleProperty does not change TIMEOUT seconds from now.
        this.timeoutCallback = stepTimer.setTimeout( () => {
          this.timeoutCallback = null; // setTimeOut removes timeoutCallback
          this.stop();
        }, TIMEOUT );
      }
    } );

    // Stop sound when the compass becomes invisible.
    compass.visibleProperty.lazyLink( visible => {
      if ( !visible ) {
        this.stop( 0 );
      }
    } );

    // Stop sound when 'Reset All' is in progress.
    isResettingAllProperty.lazyLink( isResettingAll => {
      isResettingAll && this.stop();
    } );
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  public reset(): void {

    // Clear the timer.
    this.clearTimeout();

    // Stop the clip.
    this.isPlaying && this.stop();
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

  private play(): void {

    // Start playing the sound clip.
    this.soundClip.play();

    // Fade in.
    this.soundClip.setOutputLevel( MAX_OUTPUT_LEVEL, FELUtils.secondsToTimeConstant( FADE_IN_TIME ) );
  }

  private stop( fadeOutTime = FADE_OUT_TIME ): void {

    // If stopped by the timer, clear it.
    this.clearTimeout();

    // Fade out.
    this.soundClip.setOutputLevel( 0, FELUtils.secondsToTimeConstant( fadeOutTime ) );

    // Stop when the fade has completed.
    this.soundClip.stop( fadeOutTime );
  }

  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Delete if not used.
  /**
   * Maps the compass needle angle to pitch linearly in the range [0,2*PI], a full circle. This results in an abrupt
   * change in pitch when the angle crosses the +x-axis at zero radians.
   */
  public static needleAngleToPlaybackRateCircle( angle: number ): number {

    // +angle is clockwise in the model, so flip the sign. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/19
    const normalizedAngle = FELUtils.normalizeAngle( -angle );

    const playbackRate = Utils.linear( 0, 2 * Math.PI, PLAYBACK_RATE_RANGE.min, PLAYBACK_RATE_RANGE.max, normalizedAngle );
    assert && assert( PLAYBACK_RATE_RANGE.contains( playbackRate ), `invalid playbackRate: ${playbackRate}` );
    return playbackRate;
  }

  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Delete if not used.
  /**
   * Maps the compass needle angle to pitch linearly in the range [0,PI]. Mirroring about the x-axis at zero and
   * PI radians avoids any abrupt changes in pitch.
   */
  public static needleAngleToPlaybackRateMirror( angle: number ): number {

    // +angle is clockwise in the model, so flip the sign. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/19
    let normalizedAngle = FELUtils.normalizeAngle( -angle );

    // Mirror about the x-axis at 0 and PI radians.
    if ( normalizedAngle > Math.PI ) {
      normalizedAngle = Math.abs( ( 2 * Math.PI ) - normalizedAngle );
    }

    const playbackRate = Utils.linear( 0, Math.PI, PLAYBACK_RATE_RANGE.min, PLAYBACK_RATE_RANGE.max, normalizedAngle );
    assert && assert( PLAYBACK_RATE_RANGE.contains( playbackRate ), `invalid playbackRate: ${playbackRate} normalizedAngle=${normalizedAngle}` );
    return playbackRate;
  }
}

faradaysElectromagneticLab.register( 'CompassSonifier', CompassSonifier );