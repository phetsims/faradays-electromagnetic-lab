// Copyright 2024-2025, University of Colorado Boulder

/**
 * FieldMeterDragSonifier is responsible for sonification of a FieldMeterNode view element while it is being dragged.
 *
 * The magnitude of the magnetic field at the meter's position is used to modulate the pitch of a sound clip,
 * with a constant output level. Sound plays while the user is interacting with the field meter.
 *
 * See https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 for design history.
 *
 * TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Next steps:
 * (1) Add to FieldMeterNode like this:
 *     this.addInputListener( new FieldMeterDragSonifier( fieldMeter.fieldVectorProperty, magnetStrengthRange ) );
 * (2) Decide whether to use timeout: Infinity to effectively disable the timeout during dragging
 * (3) Decide which of the fieldMagnitudeToPlaybackRate* methods to keep, and delete the others.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TInputListener from '../../../../scenery/js/input/TInputListener.js';
import { PressListenerEvent } from '../../../../scenery/js/listeners/PressListener.js';
import felFieldMeterLoop_mp3 from '../../../sounds/felFieldMeterLoop_mp3.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELSonifier from '../model/FELSonifier.js';
import FieldNode from './FieldNode.js';

// Pitch varies by 12 semitones. There are 12 semitones per octave.
const SEMITONES = 12;
const MIN_PLAYBACK_RATE = 1;
const PLAYBACK_RATE_RANGE = new Range( MIN_PLAYBACK_RATE, MIN_PLAYBACK_RATE + SEMITONES / 12 );

export default class FieldMeterDragSonifier extends FELSonifier implements TInputListener {

  private readonly isInteractingProperty: Property<boolean>;

  public constructor( fieldVectorProperty: TReadOnlyProperty<Vector2>, fieldMagnitudeRange: Range ) {

    const playbackRateProperty = new DerivedProperty( [ fieldVectorProperty ],
      fieldVector => FieldMeterDragSonifier.fieldMagnitudeToPlaybackRatePiecewiseLinear( fieldVector.magnitude, fieldMagnitudeRange ) );

    const isInteractingProperty = new BooleanProperty( false );

    super( playbackRateProperty, {
      isDisposable: false,
      wrappedAudioBuffer: felFieldMeterLoop_mp3,
      maxOutputLevel: 0.2,
      enabledProperty: new DerivedProperty( [ fieldVectorProperty, isInteractingProperty ],
        ( fieldVector, isInteracting ) => ( fieldVector.magnitude !== 0 ) && isInteracting )
    } );

    this.isInteractingProperty = isInteractingProperty;
  }

  // Interaction started using the pointer.
  public down( event: PressListenerEvent ): void {
    this.isInteractingProperty.value = true;
  }

  // Interaction ended using the pointer.
  public up( event: PressListenerEvent ): void {
    this.isInteractingProperty.value = false;
  }

  // Interaction started using the keyboard.
  public focus( event: PressListenerEvent ): void {
    this.isInteractingProperty.value = true;
  }

  // Interaction ended using the keyboard.
  public blur( event: PressListenerEvent ): void {
    this.isInteractingProperty.value = false;
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
  private static fieldMagnitudeToPlaybackRatePiecewiseLinear( fieldMagnitude: number, fieldMagnitudeRange: Range ): number {
    assert && assert( fieldMagnitudeRange.contains( fieldMagnitude ), `invalid fieldMagnitude: ${fieldMagnitude}` );

    const piecewiseCutoff = 20; // G
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
  private static fieldMagnitudeToPlaybackRateScaled( fieldMagnitude: number, fieldMagnitudeRange: Range ): number {
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

  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 This mapping is not useful. Delete it when no longer need to demonstrate.
  /**
   * Converts B-field magnitude to playback rate using a linear interpolation. This mapping is to demonstrate that
   * a linear mapping is not appropriate, because of how the B-field behaves. With a linear mapping, there will be
   * no discernible change in pitch outside the magnet.
   */
  private static fieldMagnitudeToPlaybackRateLinear( fieldMagnitude: number, fieldMagnitudeRange: Range ): number {
    assert && assert( fieldMagnitudeRange.contains( fieldMagnitude ), `invalid fieldMagnitude: ${fieldMagnitude}` );

    const playbackRate = Utils.linear( fieldMagnitudeRange.min, fieldMagnitudeRange.max,
      PLAYBACK_RATE_RANGE.min, PLAYBACK_RATE_RANGE.max,
      fieldMagnitude );

    assert && assert( PLAYBACK_RATE_RANGE.contains( playbackRate ), `unexpected playbackRate: ${playbackRate}` );
    return playbackRate;
  }
}

faradaysElectromagneticLab.register( 'FieldMeterDragSonifier', FieldMeterDragSonifier );