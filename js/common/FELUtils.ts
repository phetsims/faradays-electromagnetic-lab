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
  }
};

faradaysElectromagneticLab.register( 'FELUtils', FELUtils );
export default FELUtils;