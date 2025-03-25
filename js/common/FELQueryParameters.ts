// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELQueryParameters defines the query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import FELConstants from './FELConstants.js';

export const MagneticUnitsValues = [ 'G', 'T' ] as const;
export type MagneticUnits = ( typeof MagneticUnitsValues )[number];

export const EarthHemisphereValues = [ 'western', 'eastern' ] as const;
export type EarthHemisphere = ( typeof EarthHemisphereValues )[number];

export const CurrentFlowValues = [ 'electron', 'conventional' ] as const;
export type CurrentFlow = ( typeof CurrentFlowValues )[ number ];

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

  // Sets the convention used for current flow in the coils.
  // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/136#issuecomment-2030075672
  currentFlow: {
    type: 'string',
    defaultValue: 'electron',
    validValues: CurrentFlowValues,
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

  // Debugging tool, puts a yellow dot (small circle) where the center of each needle should be in the B-field
  // visualization. If the dots are not centered on the needles, then positioning in FieldNode is incorrect.
  // This applies to the Bar Magnet screen only, which is sufficient since FieldNode is instantiated in the
  // FELScreenView base class that is shared by all screens.
  showFieldPositions: {
    type: 'flag'
  },

  // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/167
  // This query parameter is useful for verifying the flux behavior of the pickup coil. It ignores the magnet model and
  // sets up a static gradient B-field, where all field vectors are (Bx,0),  Bx varies linearly over a range, and By is 0.
  // The value for this query parameter is the range of Bx from positions x=100 to x=650. These x positions will be indicated
  // by yellow vertical lines. This query parameter affects all screens, but is only useful in the Pickup Coil and
  // Transformer screens.
  //
  // Examples:
  // gradientField=300,300 creates a constant B-field with (Bx,By). The field is (300,0) everywhere.
  // gradientField=0,300 create a gradient B-field, where Bx changes linearly from 0 to 300, and By is 0 everywhere.
  //
  gradientField: {
    type: 'array',
    elementSchema: {
      type: 'number',
      isValidValue: ( value: number ) => ( Number.isInteger( value ) && FELConstants.MAGNET_STRENGTH_RANGE.contains( value ) )
    },
    defaultValue: null,
    isValidValue: ( array: null | number[] ) => ( array === null ) || ( array.length === 2 )
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