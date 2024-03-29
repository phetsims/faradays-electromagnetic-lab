// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELQueryParameters defines the query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';

export const MagneticUnitsValues = [ 'G', 'T' ] as const;
export type MagneticUnits = ( typeof MagneticUnitsValues )[number];

export const EarthHemisphereValues = [ 'western', 'eastern' ] as const;
export type EarthHemisphere = ( typeof EarthHemisphereValues )[number];

const SCHEMA_MAP = {

  //----------------------------------------------------------------------------------------------------------------
  // Public-facing query parameters
  //----------------------------------------------------------------------------------------------------------------

  // Magnetic units to be displayed.
  // Initializes FELPreferences.magneticUnitsProperty.
  // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/24
  magneticUnits: {
    type: 'string',
    defaultValue: 'G',
    validValues: MagneticUnitsValues,
    public: true
  },

  // Adds an "Earth" checkbox to screens where it is relevant.
  // Initializes FELPreferences.addEarthCheckboxProperty.
  // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/23
  addEarthCheckbox: {
    type: 'boolean',
    defaultValue: false,
    public: true
  },

  // Which hemisphere of the Earth to show, a sim-specific lightweight way to be inclusive.
  // Initializes FELPreferences.earthHemisphereProperty.
  // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/27
  earthHemisphere: {
    type: 'string',
    defaultValue: 'western',
    validValues: EarthHemisphereValues,
    public: true
  },

  //----------------------------------------------------------------------------------------------------------------
  // Internal query parameters
  //----------------------------------------------------------------------------------------------------------------

  // Prints info to the console that is useful for calibrating the pickup coil. See PickupCoil.calibrateEMF.
  calibrateEMF: {
    type: 'flag'
  },

  // Debugging tool, puts a yellow dot (small circle) where the center of each needle should be in the B-field
  // visualization. If the dots are not centered on the needles, then positioning in FieldNode is incorrect.
  showFieldPositions: {
    type: 'flag'
  }
} as const;

const FELQueryParameters = QueryStringMachine.getAll( SCHEMA_MAP );

// The schema map is a read-only part of the public API, in case schema details (e.g. validValues) are needed elsewhere.
FELQueryParameters.SCHEMA_MAP = SCHEMA_MAP;

faradaysElectromagneticLab.register( 'FELQueryParameters', FELQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.faradaysElectromagneticLab.FELQueryParameters' );

export default FELQueryParameters;