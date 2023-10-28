// Copyright 2023, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import { ScreenOptions } from '../../../joist/js/Screen.js';
import FELColors from './FELColors.js';
import { CreditsData } from '../../../joist/js/CreditsNode.js';

//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/2 fill in credits
const CREDITS: CreditsData = {
  leadDesign: '',
    softwareDevelopment: '',
    team: '',
    contributors: '',
    qualityAssurance: '',
    graphicArts: '',
    soundDesign: '',
    thanks: ''
};

const SCREEN_OPTIONS: Partial<ScreenOptions> = {
  backgroundColorProperty: FELColors.screenBackgroundColorProperty,
  showUnselectedHomeScreenIconFrame: true
};

const FELConstants = {

  // Sim
  CREDITS: CREDITS,

  // Screen
  SCREEN_OPTIONS: SCREEN_OPTIONS,

  // ScreenView
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15

  //TODO
};

faradaysElectromagneticLab.register( 'FELConstants', FELConstants );
export default FELConstants;