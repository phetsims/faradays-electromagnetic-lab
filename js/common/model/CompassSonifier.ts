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
 * to FieldMeterDragSonifier.
 * (2) Decide which of the needleAngleToPlaybackRate* methods to keep, and delete the others.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import felCompassSaturatedSineLoop_mp3 from '../../../sounds/felCompassSaturatedSineLoop_mp3.js';
import FELUtils from '../FELUtils.js';
import Compass from './Compass.js';
import FELSonifier from './FELSonifier.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

// Pitch varies by 10 semitones. There are 12 semitones per octave.
const SEMITONES = 10;
const MIN_PLAYBACK_RATE = 1;
const PLAYBACK_RATE_RANGE = new Range( MIN_PLAYBACK_RATE, MIN_PLAYBACK_RATE + SEMITONES / 12 );

export default class CompassSonifier extends FELSonifier {

  public constructor( compass: Compass ) {

    const playbackRateProperty = new DerivedProperty( [ compass.needleAngleProperty ],
      needleAngle => CompassSonifier.needleAngleToPlaybackRateMirror( needleAngle ) );

    super( playbackRateProperty, {
      isDisposable: false,
      wrappedAudioBuffer: felCompassSaturatedSineLoop_mp3,
      maxOutputLevel: 0.2,
      enabledProperty: compass.visibleProperty
    } );
  }

  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/77 Delete if not used.
  /**
   * Maps the compass needle angle to pitch linearly in the range [0,2*PI], a full circle. This results in an abrupt
   * change in pitch when the angle crosses the +x-axis at zero radians.
   */
  private static needleAngleToPlaybackRateCircle( angle: number ): number {

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
  private static needleAngleToPlaybackRateMirror( angle: number ): number {

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