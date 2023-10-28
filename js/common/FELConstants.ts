// Copyright 2023, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import { ScreenOptions } from '../../../joist/js/Screen.js';
import FELColors from './FELColors.js';

const SCREEN_OPTIONS: ScreenOptions = {
  backgroundColorProperty: FELColors.screenBackgroundColorProperty,
  showUnselectedHomeScreenIconFrame: true,
};

const FELConstants = {

  // Screen
  SCREEN_OPTIONS: SCREEN_OPTIONS,

  // ScreenView
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15

  //TODO
};

faradaysElectromagneticLab.register( 'FELConstants', FELConstants );
export default FELConstants;