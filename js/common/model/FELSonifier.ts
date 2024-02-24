// Copyright 2024, University of Colorado Boulder

/**
 * FELSonifier is the base class for 'sonifiers'. This is a pattern that I was experimenting with during sonification
 * of Faraday's Electromagnetic Lab. It is not necessarily ready for production.
 *
 * Responsibilities include:
 * - creating the SoundClip for a sound file
 * - modulating the sound's playback rate
 * - playing and stopping the sound when the playback rate has not changed, with fade in and face out
 *
 *  See https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 and https://github.com/phetsims/faradays-electromagnetic-lab/issues/78.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable, { DisposableOptions } from '../../../../axon/js/Disposable.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TEmitter, { TEmitterListener } from '../../../../axon/js/TEmitter.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { stepTimer } from '../../../../axon/js/imports.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import FELUtils from '../FELUtils.js';
import isResettingAllProperty from '../isResettingAllProperty.js';
import WrappedAudioBuffer from '../../../../tambo/js/WrappedAudioBuffer.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';

type SelfOptions = {

  // The audio file to play using a SoundClip.
  wrappedAudioBuffer: WrappedAudioBuffer;

  // Max output level when the sound is playing.
  maxOutputLevel?: number;

  // The Emitter (which provides a dt {number} value on emit) which drives the animation, or null if the client
  // will drive the animation by calling step(dt) manually. Defaults to stepTimer (the joist Timer) which fires
  // automatically when Sim is stepped.
  stepEmitter?: TEmitter<[ number ]> | null;

  // If the compass is at rest this long (in seconds), sound will fade out and stop.
  // Setting this to Infinity will effectively disable the timeout.
  timeout?: number;

  // Fade times, in seconds.
  fadeInTime?: number;
  fadeOutTime?: number;

  // Used to enable and disable the sonfier.
  enabledProperty?: TReadOnlyProperty<boolean> | null;
};

export type FELSonifierOptions = SelfOptions & DisposableOptions;

export default class FELSonifier extends Disposable {

  // SoundClip to be played.
  private readonly soundClip: SoundClip;

  // Playback rate at which soundClip is playing.
  private readonly playbackRateProperty: TReadOnlyProperty<number>;

  // Controls whether soundClip is playing.
  private readonly isPlayingProperty: Property<boolean>;

  // If playbackRateProperty does not change for this amount of time (in seconds), sound will fade out and stop.
  private readonly timeout: number;

  // The last time that playbackRateProperty changed.
  private lastChangedTime: number | null;

  protected constructor( playbackRateProperty: TReadOnlyProperty<number>, providedOptions?: FELSonifierOptions ) {

    const options = optionize<FELSonifierOptions, SelfOptions, DisposableOptions>()( {

      // SelfOptions
      maxOutputLevel: 1,
      stepEmitter: stepTimer,
      timeout: 0.5,
      fadeInTime: 0.25,
      fadeOutTime: 0.25,
      enabledProperty: null
    }, providedOptions );

    assert && assert( options.maxOutputLevel > 0, `invalid timeout: ${options.maxOutputLevel}` );
    assert && assert( options.timeout > 0, `invalid timeout: ${options.timeout}` );
    assert && assert( options.fadeInTime >= 0, `invalid fadeInTime: ${options.fadeInTime}` );
    assert && assert( options.fadeOutTime >= 0, `invalid fadeOutTime: ${options.fadeOutTime}` );

    super( options );

    this.soundClip = new SoundClip( options.wrappedAudioBuffer, {
      loop: true,
      initialOutputLevel: 0
    } );
    soundManager.addSoundGenerator( this.soundClip );
    this.disposeEmitter.addListener( () => soundManager.removeSoundGenerator( this.soundClip ) );

    this.playbackRateProperty = playbackRateProperty;
    const playbackRateListener = ( playbackRate: number ) => {
      if ( !options.enabledProperty || options.enabledProperty.value ) {
        this.lastChangedTime = Date.now();
        this.isPlayingProperty.value = true;
        this.soundClip.setPlaybackRate( playbackRate );
      }
    };
    playbackRateProperty.lazyLink( playbackRateListener );

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

    // Stop sound when 'Reset All' is in progress.
    const isResettingAllListener = ( isResettingAll: boolean ) => {
      if ( isResettingAll ) {
        this.isPlayingProperty.value = false;
      }
    };
    isResettingAllProperty.lazyLink( isResettingAllListener );
    this.disposeEmitter.addListener( () => {
      if ( isResettingAllProperty.hasListener( isResettingAllListener ) ) {
        isResettingAllProperty.unlink( isResettingAllListener );
      }
    } );

    // Stop sound when the sonifier is disabled.
    if ( options.enabledProperty ) {
      const enabledProperty = options.enabledProperty;

      const enabledPropertyListener = ( enabled: boolean ) => {
        if ( !enabled ) {
          this.isPlayingProperty.value = false;
        }
      };
      enabledProperty.lazyLink( enabledPropertyListener );

      this.disposeEmitter.addListener( () => {
        if ( enabledProperty.hasListener( enabledPropertyListener ) ) {
          enabledProperty.unlink( enabledPropertyListener );
        }
      } );
    }

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
  }

  public step( dt: number ): void {

    // If this.timeout seconds have passed since playbackRateProperty changed, stop the sound.
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
}

faradaysElectromagneticLab.register( 'FELSonifier', FELSonifier );