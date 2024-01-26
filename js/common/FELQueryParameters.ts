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

  // Spacing (x & y) between needles in the magnetic field visualization.
  needleSpacing: {
    type: 'number',
    defaultValue: 40,
    isValidValue: ( value: number ) => ( value >= 35 && value <= 100 )
  },

  // Length (tip to tip) of needles in the magnetic field visualization.
  // The other dimension is computed to provide a consistent aspect ratio.
  needleLength: {
    type: 'number',
    defaultValue: 25,
    isValidValue: ( value: number ) => ( value >= 20 && value <= 60 )
  },

  // KeyboardDragListenerOptions.dragVelocity for all draggable objects
  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/54
  dragVelocity: {
    type: 'number',
    defaultValue: 500,
    isValidValue: ( value: number ) => ( value > 0 )
  },

  // KeyboardDragListenerOptions.shiftDragVelocity for all draggable objects
  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/54
  shiftDragVelocity: {
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