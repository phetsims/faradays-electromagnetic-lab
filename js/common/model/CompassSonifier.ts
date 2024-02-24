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
 * TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Next steps:
 * (1) Using a 'model sonifier' for the compass is inconsistent with using a 'view sonifier' for the field meter; they are
 * both tools for measuring the B-field, and should have a similar sonification. Having the compass constantly making
 * sound is also an annoying UX, and likely to encourage users to hide the compass. And having the compass constantly
 * making sound is likely to interfere with other sounds to be added later, some of which are more pedagogically
 * important, like the sound associated with change in flux. So I recommend changing to a 'view sonifier', similar
 * to FieldMeterSonifier.
 * (2) Decide which of the needleAngleToPlaybackRate* methods to keep, and delete the others.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Disposable, DisposableOptions, stepTimer, TEmitterListener } from '../../../../axon/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Utils from '../../../../dot/js/Utils.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import felCompassSaturatedSineLoop_mp3 from '../../../sounds/felCompassSaturatedSineLoop_mp3.js';
import FELUtils from '../FELUtils.js';
import Compass from './Compass.js';
import isResettingAllProperty from '../isResettingAllProperty.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import WrappedAudioBuffer from '../../../../tambo/js/WrappedAudioBuffer.js';

// Pitch varies by 10 semitones. There are 12 semitones per octave.
const SEMITONES = 10;
const MIN_PLAYBACK_RATE = 1;
const PLAYBACK_RATE_RANGE = new Range( MIN_PLAYBACK_RATE, MIN_PLAYBACK_RATE + SEMITONES / 12 );

type SelfOptions = {

  // The audio file to play using a tambo SoundClip.
  wrappedAudioBuffer?: WrappedAudioBuffer;

  // Max output level when the sound is playing.
  maxOutputLevel?: number;

  // The Emitter (which provides a dt {number} value on emit) which drives the animation, or null if the client
  // will drive the animation by calling step(dt) manually. Defaults to stepTimer (the joist Timer) which fires
  // automatically when Sim is stepped.
  stepEmitter?: TEmitter<[ number ]> | null;

  // If the compass is at rest this long (in seconds), sound will fade out and stop.
  timeout?: number;

  // Fade times, in seconds.
  fadeInTime?: number;
  fadeOutTime?: number;
};

type CompassSonifierOptions = SelfOptions & DisposableOptions;

export default class CompassSonifier extends Disposable {

  // Pitch of soundClip is modulated by the needle angle, output level is constant.
  private readonly soundClip: SoundClip;

  // Controls whether soundClip is playing.
  private readonly isPlayingProperty: Property<boolean>;

  // If the compass is at rest this long (in ms), sound will fade out and stop.
  private readonly timeout: number;

  // The last time that compass.needleProperty changed.
  private lastChangedTime: number | null;

  public constructor( compass: Compass, providedOptions?: CompassSonifierOptions ) {

    const options = optionize<CompassSonifierOptions, SelfOptions, DisposableOptions>()( {

      // SelfOptions
      wrappedAudioBuffer: felCompassSaturatedSineLoop_mp3,
      maxOutputLevel: 0.2,
      stepEmitter: stepTimer,
      timeout: 0.5,
      fadeInTime: 0.25,
      fadeOutTime: 0.25
    }, providedOptions );

    assert && assert( options.timeout > 0, `invalid timeout: ${options.timeout}` );
    assert && assert( options.fadeInTime >= 0, `invalid fadeInTime: ${options.fadeInTime}` );
    assert && assert( options.fadeOutTime >= 0, `invalid fadeOutTime: ${options.fadeOutTime}` );

    super( options );

    this.soundClip = new SoundClip( options.wrappedAudioBuffer, {
      loop: true,
      initialOutputLevel: 0
    } );
    soundManager.addSoundGenerator( this.soundClip );

    this.isPlayingProperty = new BooleanProperty( false );

    this.isPlayingProperty.lazyLink( isPlaying => {
      if ( isPlaying ) {
        this.soundClip.play();
        this.soundClip.setOutputLevel( options.maxOutputLevel, FELUtils.secondsToTimeConstant( options.fadeInTime ) );
      }
      else {
        this.soundClip.setOutputLevel( 0, FELUtils.secondsToTimeConstant( options.fadeOutTime ) );
        this.soundClip.stop( options.fadeOutTime );
      }
    } );

    this.timeout = options.timeout;
    this.lastChangedTime = null;

    // Map needle angle to playback rate.
    const needleAngleListener = ( needleAngle: number ) => {
      if ( compass.visibleProperty.value ) {

        this.lastChangedTime = Date.now();

        this.isPlayingProperty.value = true;

        // Map angle to playback rate.
        const playbackRate = CompassSonifier.needleAngleToPlaybackRateMirror( needleAngle );
        this.soundClip.setPlaybackRate( playbackRate );
      }
    };
    compass.needleAngleProperty.lazyLink( needleAngleListener );

    // Stop sound when the compass becomes invisible.
    const visiblePropertyListener = ( visible: boolean ) => {
      if ( !visible ) {
        this.isPlayingProperty.value = false;
      }
    };
    compass.visibleProperty.lazyLink( visiblePropertyListener );

    // Stop sound when 'Reset All' is in progress.
    const isResettingAllListener = ( isResettingAll: boolean ) => {
      if ( isResettingAll ) {
        this.isPlayingProperty.value = false;
      }
    };
    isResettingAllProperty.lazyLink( isResettingAllListener );

    // Wire up to the provided Emitter, if any. Whenever this animation is started, it will add a listener to the Timer
    // (and conversely, will be removed when stopped). This means it will animate with the timer, but will not leak
    // memory as long as the animation doesn't last forever.
    if ( options.stepEmitter ) {
      const stepEmitter = options.stepEmitter;
      const stepListener: TEmitterListener<[ number ]> = this.step.bind( this );

      this.isPlayingProperty.link( isPlaying => {
        if ( isPlaying && !stepEmitter.hasListener( stepListener ) ) {
          stepEmitter.addListener( stepListener );
        }
        else if ( !isPlaying && stepEmitter.hasListener( stepListener ) ) {
          stepEmitter.removeListener( stepListener );
        }
      } );

      this.disposeEmitter.addListener( () => {
        if ( stepEmitter.hasListener( stepListener ) ) {
          stepEmitter.removeListener( stepListener );
        }
      } );
    }

    this.disposeEmitter.addListener( () => {

      if ( compass.needleAngleProperty.hasListener( needleAngleListener ) ) {
        compass.needleAngleProperty.unlink( needleAngleListener );
      }

      if ( compass.needleAngleProperty.hasListener( needleAngleListener ) ) {
        compass.needleAngleProperty.unlink( needleAngleListener );
      }

      if ( isResettingAllProperty.hasListener( isResettingAllListener ) ) {
        isResettingAllProperty.unlink( isResettingAllListener );
      }
    } );
  }

  public step( dt: number ): void {

    // If this.timeout seconds have passed since needleProperty changed, stop the sound.
    if ( this.lastChangedTime !== null ) {
      if ( Date.now() - this.lastChangedTime >= ( this.timeout * 1000 ) ) {
        this.isPlayingProperty.value = false;
      }
    }
  }

  public reset(): void {
    this.isPlayingProperty.reset();
    this.lastChangedTime = null;
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