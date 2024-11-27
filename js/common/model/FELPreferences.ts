// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELPreferences is the model for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELQueryParameters, { CurrentFlow, CurrentFlowValues, EarthHemisphere, EarthHemisphereValues, MagneticUnits, MagneticUnitsValues } from '../FELQueryParameters.js';

type SelfOptions = {

  // Whether the sim has the feature for changing the convention for current flow.
  hasCurrentFlowFeature?: boolean;

  // Whether the sim has the feature that shows the alignment of a bar magnet with planet Earth.
  hasEarthFeature?: boolean;

  // Initial values for Properties
  magneticUnits?: MagneticUnits;
  currentFlow?: CurrentFlow;
  addEarthCheckbox?: boolean;
  earthHemisphere?: EarthHemisphere;
};

export type FELPreferencesOptions = SelfOptions;

export default class FELPreferences {

  // See SelfOptions
  public readonly hasCurrentFlowFeature: boolean;
  public readonly hasEarthFeature: boolean;

  // Magnetic units to be displayed by the Field Meter.
  public readonly magneticUnitsProperty: StringUnionProperty<MagneticUnits>;

  // The convention used for current flow in the coils.
  public readonly currentFlowProperty: StringUnionProperty<CurrentFlow>;

  // Whether an "Earth" checkbox will be added to relevant screens.
  public readonly addEarthCheckboxProperty: Property<boolean>;

  // Which hemisphere of the Earth to show when the "Earth" checkbox is checked.
  public readonly earthHemisphereProperty: StringUnionProperty<EarthHemisphere>;

  public constructor( providedOptions?: FELPreferencesOptions ) {

    const options = optionize<FELPreferencesOptions, SelfOptions>()( {

      // SelfOptions
      hasCurrentFlowFeature: true,
      hasEarthFeature: true,
      magneticUnits: FELQueryParameters.magneticUnits as MagneticUnits,
      currentFlow: FELQueryParameters.currentFlow as CurrentFlow,
      addEarthCheckbox: FELQueryParameters.addEarthCheckbox,
      earthHemisphere: FELQueryParameters.earthHemisphere as EarthHemisphere
    }, providedOptions );

    this.hasCurrentFlowFeature = options.hasCurrentFlowFeature;
    this.hasEarthFeature = options.hasEarthFeature;

    this.magneticUnitsProperty = new StringUnionProperty<MagneticUnits>( options.magneticUnits, {
      validValues: MagneticUnitsValues,
      tandem: Tandem.PREFERENCES.createTandem( 'magneticUnitsProperty' ),
      phetioFeatured: true
    } );

    this.currentFlowProperty = new StringUnionProperty<CurrentFlow>( options.currentFlow, {
      validValues: CurrentFlowValues,
      tandem: options.hasCurrentFlowFeature ? Tandem.PREFERENCES.createTandem( 'currentFlowProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true
    } );

    this.addEarthCheckboxProperty = new BooleanProperty( options.addEarthCheckbox, {
      tandem: options.hasEarthFeature ? Tandem.PREFERENCES.createTandem( 'addEarthCheckboxProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true
    } );

    this.earthHemisphereProperty = new StringUnionProperty<EarthHemisphere>( options.earthHemisphere, {
      validValues: EarthHemisphereValues,
      tandem: options.hasEarthFeature ? Tandem.PREFERENCES.createTandem( 'earthHemisphereProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true
    } );
  }
}

faradaysElectromagneticLab.register( 'FELPreferences', FELPreferences );