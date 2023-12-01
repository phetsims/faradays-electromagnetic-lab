// Copyright 2023, University of Colorado Boulder

/**
 * FELPreferences is the model for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FELQueryParameters from '../FELQueryParameters.js';

const FELPreferences = {

  // Property for adding an "Earth" checkbox in relevant screens
  addEarthCheckboxProperty: new BooleanProperty( FELQueryParameters.addEarthCheckbox, {
    tandem: Tandem.PREFERENCES.createTandem( 'addEarthCheckboxProperty' ),
    phetioFeatured: true
  } )
};

faradaysElectromagneticLab.register( 'FELPreferences', FELPreferences );
export default FELPreferences;