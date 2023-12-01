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
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import FELQueryParameters, { MagneticUnits, MagneticUnitsValues } from '../FELQueryParameters.js';

const FELPreferences = {

  // Magnetic units to be displayed
  magneticUnitsProperty: new StringUnionProperty<MagneticUnits>( FELQueryParameters.magneticUnits as MagneticUnits, {
    validValues: MagneticUnitsValues,
    tandem: Tandem.PREFERENCES.createTandem( 'functionVariableProperty' ),
    phetioFeatured: true
  } ),

  // Whether an "Earth" checkbox will be added to relevant screens
  addEarthCheckboxProperty: new BooleanProperty( FELQueryParameters.addEarthCheckbox, {
    tandem: Tandem.PREFERENCES.createTandem( 'addEarthCheckboxProperty' ),
    phetioFeatured: true
  } )
};

faradaysElectromagneticLab.register( 'FELPreferences', FELPreferences );
export default FELPreferences;