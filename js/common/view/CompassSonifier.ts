// Copyright 2024, University of Colorado Boulder

//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Lots of duplication with FieldMeterSonifier
/**
 * CompassSonifier is responsible for sonification of the compass. The angle of the magnetic field at the
 * compass position is mapped to the pitch of a sound clip, with a constant output level. Sound plays continuously
 * during the drag cycle of the compass, for both pointer and keyboard dragging.
 *
 * See https://github.com/phetsims/faradays-electromagnetic-lab/issues/78 for design history.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { PressListenerEvent, TInputListener } from '../../../../scenery/js/imports.js';
import { Disposable, PropertyLinkListener, TReadOnlyProperty } from '../../../../axon/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Utils from '../../../../dot/js/Utils.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import felCompassSaturatedSineLoop_wav from '../../../sounds/felCompassSaturatedSineLoop_wav.js';
import FELUtils from '../FELUtils.js';

// Pitch varies by 10 semitones. There are 12 semitones per octave.
const SEMITONES = 10;
const MIN_PLAYBACK_RATE = 1;
const PLAYBACK_RATE_RANGE = new Range( MIN_PLAYBACK_RATE, MIN_PLAYBACK_RATE + SEMITONES / 12 );

// Output level is constant, except during fades, or when field magnitude is zero.
const MAX_OUTPUT_LEVEL = 0.7;

// Fade times, in seconds.
const FADE_IN_TIME = 0.25;
const FADE_OUT_TIME = 0.25;

export default class CompassSonifier implements TInputListener {

  // Pitch of soundClip is modulated to match field magnitude. The clip plays continuously during a drag cycle.
  private readonly soundClip: SoundClip;

  // fieldVectorProperty is observed by fieldVectorListener while a drag cycle is in progress.
  private readonly fieldVectorProperty: TReadOnlyProperty<Vector2>;
  private readonly fieldVectorListener: PropertyLinkListener<Vector2>;

  public constructor( fieldVectorProperty: TReadOnlyProperty<Vector2> ) {

    this.soundClip = new SoundClip( felCompassSaturatedSineLoop_wav, {
      loop: true,
      initialOutputLevel: MAX_OUTPUT_LEVEL
    } );
    soundManager.addSoundGenerator( this.soundClip );

    this.fieldVectorProperty = fieldVectorProperty;

    this.fieldVectorListener = fieldVector => {
      const playbackRate = CompassSonifier.fieldAngleToPlaybackRateMirror( fieldVector.angle );
      this.soundClip.setPlaybackRate( playbackRate );
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
   * Maps compass angle to pitch linearly in the range [0,2*PI], a full circle. This results in an abrupt change
   * in pitch when the angle crosses the +x-axis at zero radians.
   */
  public static fieldAngleToPlaybackRateCircle( angle: number ): number {

    // +angle is clockwise in the model, so flip the sign. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/19
    const normalizedAngle = FELUtils.normalizeAngle( -angle );

    const playbackRate = Utils.linear( 0, 2 * Math.PI, PLAYBACK_RATE_RANGE.min, PLAYBACK_RATE_RANGE.max, normalizedAngle );
    assert && assert( PLAYBACK_RATE_RANGE.contains( playbackRate ), `invalid playbackRate: ${playbackRate}` );
    return playbackRate;
  }

  /**
   * Maps compass angle to pitch linearly in the range [0,PI]. Mirroring about the x-axis at zero and PI radians
   * avoids any abrupt changes in pitch.
   */
  public static fieldAngleToPlaybackRateMirror( angle: number ): number {

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

faradaysElectromagneticLab.register( 'CompassSonifier', CompassSonifier );