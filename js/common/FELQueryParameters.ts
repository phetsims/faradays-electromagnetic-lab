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

  // Magnetic units to be displayed. Initializes FELPreferences.magneticUnitsProperty.
  magneticUnits: {
    type: 'string',
    defaultValue: 'G',
    validValues: MagneticUnitsValues,
    public: true
  },

  // Adds an "Earth" checkbox to screens where it is relevant. Initializes FELPreferences.addEarthCheckboxProperty.
  addEarthCheckbox: {
    type: 'boolean',
    defaultValue: false,
    public: true
  },

  // Which hemisphere of the Earth to show
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

  // KeyboardDragListenerOptions.dragSpeed for all draggable objects
  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/54
  dragSpeed: {
    type: 'number',
    defaultValue: 500,
    isValidValue: ( value: number ) => ( value > 0 )
  },

  // KeyboardDragListenerOptions.shiftDragSpeed for all draggable objects
  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/54
  shiftDragSpeed: {
    type: 'number',
    defaultValue: 250,
    isValidValue: ( value: number ) => ( value > 0 )
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