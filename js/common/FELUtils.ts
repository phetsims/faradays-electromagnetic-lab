// Copyright 2024, University of Colorado Boulder

/**
 * FELUtils is a collection of utility functions, some of which may have only been used for debugging.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import Utils from '../../../dot/js/Utils.js';

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
  }
};

faradaysElectromagneticLab.register( 'FELUtils', FELUtils );
export default FELUtils;