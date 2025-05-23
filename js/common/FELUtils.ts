// Copyright 2024, University of Colorado Boulder

/**
 * FELUtils is a collection of utility functions, some of which may have only been used for debugging.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../dot/js/Utils.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';

const FELUtils = {

  /**
   * Converts radians to degrees, with optional number of decimal places.
   */
  toDegrees( radians: number, decimalPlaces = 0 ): number {
    return Utils.toFixedNumber( Utils.toDegrees( radians ), decimalPlaces );
  },

  /**
   * Normalizes an angle (in radians) so that it in the range [ 0, 2 * Math.PI ] radians.
   */
  normalizeAngle( angle: number ): number {
    const remainder = angle % ( 2 * Math.PI );
    const normalizedAngle = ( remainder >= 0 ) ? Math.abs( remainder ) : ( 2 * Math.PI + remainder );
    assert && assert( normalizedAngle >= 0 && normalizedAngle <= 2 * Math.PI, `unexpected normalizedAngle: ${normalizedAngle}` );
    return normalizedAngle;
  },

  /**
   * SoundClip.setOutputLevel uses WebAudio setTargetAtTime to set output level, with optional fade. The timeConstant
   * argument to setTargetAtTime is NOT the fade time, it's an exponential approach to the target output level.
   * Doc for setTargetAtTime at https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime#timeconstant
   * says: "Depending on your use case, getting 95% toward the target value may already be enough; in that case, you
   * could set timeConstant to one third of the desired duration."  So that's the basis for this implementation.
   */
  secondsToTimeConstant( seconds: number ): number {
    return seconds / 3;
  }
};

faradaysElectromagneticLab.register( 'FELUtils', FELUtils );
export default FELUtils;