// Copyright 2023-2024, University of Colorado Boulder

//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Can this be generalized for other similar sound designs?
/**
 * FieldMeterSoundListener is responsible for sound related to the field meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { PressListenerEvent, TInputListener } from '../../../../scenery/js/imports.js';
import { Disposable, stepTimer, TimerListener, TReadOnlyProperty } from '../../../../axon/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import felFieldMeterLoop_mp3 from '../../../sounds/felFieldMeterLoop_mp3.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import Utils from '../../../../dot/js/Utils.js';
import FieldNode from './FieldNode.js';

const OUTPUT_LEVEL = 0.7;

const PLAYBACK_RATE_RANGE = new Range( 1, 2 ); // 1 octave

// Fade out parameters
const FADE_OUT_INTERVAL = 500; // time over which fade out occurs, in ms
const FADE_OUTPUT_LEVEL_DELTA = 0.1; // change in output level per step
const FADE_OUT_STEPS = PLAYBACK_RATE_RANGE.getLength() / FADE_OUTPUT_LEVEL_DELTA; // steps to complete the fade out

export default class FieldMeterSoundListener implements TInputListener {

  private readonly soundClip: SoundClip;

  private readonly fieldVectorProperty: TReadOnlyProperty<Vector2>;
  private readonly fieldMagnitudeRange: Range;
  private readonly fieldVectorListener: ( fieldVector: Vector2 ) => void;

  private stepTimerListener: TimerListener | null;
  private readonly fadeOutAndStopCallback: () => void;

  public constructor( fieldVectorProperty: TReadOnlyProperty<Vector2>, fieldMagnitudeRange: Range, fieldScaleProperty: TReadOnlyProperty<number> ) {

    this.soundClip = new SoundClip( felFieldMeterLoop_mp3, {
      initialOutputLevel: OUTPUT_LEVEL,
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
        this.soundClip.setOutputLevel( OUTPUT_LEVEL );
      }
    };

    this.stepTimerListener = null;

    this.fadeOutAndStopCallback = () => {
      assert && assert( this.stepTimerListener, 'expected stepTimerListener to be set' );
      const outputLevel = Math.max( 0, this.soundClip.outputLevel - FADE_OUTPUT_LEVEL_DELTA );
      this.soundClip.setOutputLevel( outputLevel );
      if ( outputLevel === 0 ) {
        this.soundClip.stop();
        stepTimer.clearInterval( this.stepTimerListener! );
      }
    };
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  public down( event: PressListenerEvent ): void {
    this.startSound();
  }

  public up( event: PressListenerEvent ): void {
    this.stopSound();
  }

  public focus( event: PressListenerEvent ): void {
    this.startSound();
  }

  public blur( event: PressListenerEvent ): void {
    this.stopSound();
  }

  private startSound(): void {
    phet.log && phet.log( 'FieldMeterSoundListener startSound' );
    this.fieldVectorProperty.link( this.fieldVectorListener );
    this.stepTimerListener && stepTimer.clearInterval( this.stepTimerListener ); // Clear the fade that was in progress.
    this.soundClip.setOutputLevel( OUTPUT_LEVEL );
    this.soundClip.play();
  }

  private stopSound(): void {
    phet.log && phet.log( 'FieldMeterSoundListener stopSound' );
    this.fieldVectorProperty.unlink( this.fieldVectorListener );
    this.stepTimerListener = stepTimer.setInterval( this.fadeOutAndStopCallback, FADE_OUT_INTERVAL / FADE_OUT_STEPS );
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