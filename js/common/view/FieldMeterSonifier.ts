// Copyright 2024, University of Colorado Boulder

/**
 * FieldMeterSonifier is responsible for sonification of a FieldMeterNode view element.
 *
 * The magnitude of the magnetic field at the meter's position is used to modulate the pitch of a sound clip,
 * with a constant output level. Sound plays continuously during the drag cycle of the field meter, for both
 * pointer and keyboard dragging.
 *
 * See https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 for design history.
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

export default class FieldMeterSonifier implements TInputListener {

  // Pitch of soundClip is modulated to match field magnitude. The clip plays continuously during a drag cycle.
  private readonly soundClip: SoundClip;

  // fieldVectorProperty is observed by fieldVectorListener while a drag cycle is in progress.
  private readonly fieldVectorProperty: TReadOnlyProperty<Vector2>;
  private readonly fieldVectorListener: PropertyLinkListener<Vector2>;

  public constructor( fieldVectorProperty: TReadOnlyProperty<Vector2>, fieldMagnitudeRange: Range ) {

    this.soundClip = new SoundClip( felFieldMeterLoop_mp3, {
      loop: true,
      initialOutputLevel: 0
    } );
    soundManager.addSoundGenerator( this.soundClip );

    this.fieldVectorProperty = fieldVectorProperty;

    this.fieldVectorListener = fieldVector => {
      if ( fieldVector.magnitude === 0 ) {
        this.soundClip.setOutputLevel( 0 );
      }
      else {
        const playbackRate = FieldMeterSonifier.fieldMagnitudeToPlaybackRatePiecewiseLinear( fieldVector.magnitude, fieldMagnitudeRange );
        assert && assert( PLAYBACK_RATE_RANGE.contains( playbackRate ), `invalid playbackRate: ${playbackRate}` );
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
    this.soundClip.setOutputLevel( outputLevel, FELUtils.secondsToTimeConstant( FADE_IN_TIME ) );
  }

  private stop(): void {

    // Stop observing fieldVectorProperty.
    if ( this.fieldVectorProperty.hasListener( this.fieldVectorListener ) ) {
      this.fieldVectorProperty.unlink( this.fieldVectorListener );
    }

    // Fade out.
    this.soundClip.setOutputLevel( 0, FELUtils.secondsToTimeConstant( FADE_OUT_TIME ) );

    // Stop when the fade has completed.
    this.soundClip.stop( FADE_OUT_TIME );
  }

  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Delete if not used.
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

  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Delete if not used.
  /**
   * Converts B-field magnitude to playback rate using a piecewise linear interpolation, where the range is divided
   * into 2 separate linear mappings.
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
}

faradaysElectromagneticLab.register( 'FieldMeterSonifier', FieldMeterSonifier );