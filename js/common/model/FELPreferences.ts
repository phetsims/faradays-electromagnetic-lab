// Copyright 2023-2024, University of Colorado Boulder

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
import FELQueryParameters, { CurrentFlow, CurrentFlowValues, EarthHemisphere, EarthHemisphereValues, MagneticUnits, MagneticUnitsValues } from '../FELQueryParameters.js';

const FELPreferences = {

  // Magnetic units to be displayed by the Field Meter.
  magneticUnitsProperty: new StringUnionProperty<MagneticUnits>( FELQueryParameters.magneticUnits as MagneticUnits, {
    validValues: MagneticUnitsValues,
    tandem: Tandem.PREFERENCES.createTandem( 'magneticUnitsProperty' ),
    phetioFeatured: true
  } ),

  // The convention used for current flow in the coils.
  currentFlowProperty: new StringUnionProperty<CurrentFlow>( FELQueryParameters.currentFlow as CurrentFlow, {
    validValues: CurrentFlowValues,
    tandem: Tandem.PREFERENCES.createTandem( 'currentFlowProperty' ),
    phetioFeatured: true
  } ),

  // Whether an "Earth" checkbox will be added to relevant screens.
  addEarthCheckboxProperty: new BooleanProperty( FELQueryParameters.addEarthCheckbox, {
    tandem: Tandem.PREFERENCES.createTandem( 'addEarthCheckboxProperty' ),
    phetioFeatured: true
  } ),

  // Which hemisphere of the Earth to show when the "Earth" checkbox is checked.
  earthHemisphereProperty: new StringUnionProperty<EarthHemisphere>( FELQueryParameters.earthHemisphere as EarthHemisphere, {
    validValues: EarthHemisphereValues,
    tandem: Tandem.PREFERENCES.createTandem( 'earthHemisphereProperty' ),
    phetioFeatured: true
  } )
};

faradaysElectromagneticLab.register( 'FELPreferences', FELPreferences );
export default FELPreferences;