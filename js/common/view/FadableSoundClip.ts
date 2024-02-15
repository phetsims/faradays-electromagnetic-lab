// Copyright 2024, University of Colorado Boulder

//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Should fades be logarithmic?
/**
 * FadableSoundClip is an extension of SoundClip that supports fading in and fading out.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import { TimerListener } from '../../../../axon/js/Timer.js';
import WrappedAudioBuffer from '../../../../tambo/js/WrappedAudioBuffer.js';
import { optionize } from '../../../../phet-core/js/imports.js';
import { stepTimer } from '../../../../axon/js/imports.js';

type SelfOptions = {

  // Change in the output level on each step, [0,1]
  deltaOutputLevel?: number;

  // dt for each fade-in step, in ms.
  dtFadeIn?: number;

  // dt for each fade-out step, in ms.
  dtFadeOut?: number; // ms
};

export type FadableSoundClipOptions = SelfOptions & SoundClipOptions;

export default class FadableSoundClip extends SoundClip {

  // See SelfOptions
  private readonly deltaOutputLevel: number;
  private readonly dtFadeIn: number;
  private readonly dtFadeOut: number;

  // Output level immediately before we start to fade in
  private fadeInOutputLevel: number;

  // Listener returned by stepTimer.setInterval, to be stopped using stepTimer.clearInterval
  private stepTimerListener: TimerListener | null;

  public constructor( wrappedAudioBuffer: WrappedAudioBuffer, providedOptions?: FadableSoundClipOptions ) {

    const options = optionize<FadableSoundClipOptions, SelfOptions, SoundClipOptions>()( {

      // SelfOptions
      deltaOutputLevel: 0.1,
      dtFadeIn: 10,
      dtFadeOut: 10
    }, providedOptions );

    super( wrappedAudioBuffer, options );

    this.deltaOutputLevel = options.deltaOutputLevel;
    this.dtFadeIn = options.dtFadeIn;
    this.dtFadeOut = options.dtFadeOut;
    this.fadeInOutputLevel = this.outputLevel;
    this.stepTimerListener = null;
  }

  /**
   * Plays the sound clip, with fade in.
   */
  public override play(): void {
    assert && assert( !this.isPlaying );

    // Clear a fade that was in progress.
    if ( this.stepTimerListener ) {
      stepTimer.clearInterval( this.stepTimerListener );
    }

    // Fade in to the current output level.
    this.fadeInOutputLevel = this.outputLevel;
    this.outputLevel = 0;
    super.play();
    this.stepTimerListener = stepTimer.setInterval( this.fadeIn.bind( this ), this.dtFadeIn );
  }

  /**
   * Plays the sound clip, with fade out.
   */
  public override stop(): void {
    assert && assert( this.isPlaying );

    // Clear a fade that was in progress.
    if ( this.stepTimerListener ) {
      stepTimer.clearInterval( this.stepTimerListener );
    }

    // Fade out.
    this.stepTimerListener = stepTimer.setInterval( this.fadeOut.bind( this ), this.dtFadeOut );
  }

  /**
   * Callback for stepTimer.setInterval that fades in the sound by increasing its output level over time,
   * until it reaches this.fadeInOutputLevel.
   */
  private fadeIn(): void {
    assert && assert( this.stepTimerListener, 'expected stepTimerListener to be set' );
    this.outputLevel = Math.min( this.fadeInOutputLevel, this.outputLevel + this.deltaOutputLevel );
    if ( this.outputLevel === this.fadeInOutputLevel ) {
      stepTimer.clearInterval( this.stepTimerListener! );
      this.stepTimerListener = null;
    }
  }

  /**
   * Callback for stepTimer.setInterval that fades out the sound by reducing the output level over time,
   * until it reaches 0.
   */
  private fadeOut(): void {
    assert && assert( this.stepTimerListener, 'expected stepTimerListener to be set' );
    this.outputLevel = Math.max( 0, this.outputLevel - this.deltaOutputLevel );
    if ( this.outputLevel === 0 ) {
      super.stop();
      stepTimer.clearInterval( this.stepTimerListener! );
      this.stepTimerListener = null;
    }
  }
}

faradaysElectromagneticLab.register( 'FadableSoundClip', FadableSoundClip );