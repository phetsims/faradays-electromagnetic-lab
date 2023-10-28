// Copyright 2023, University of Colorado Boulder

/**
 * FELQueryParameters defines the query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';

const SCHEMA_MAP = {

  //----------------------------------------------------------------------------------------------------------------
  // Public-facing query parameters
  //----------------------------------------------------------------------------------------------------------------

  //TODO

  //----------------------------------------------------------------------------------------------------------------
  // Internal query parameters
  //----------------------------------------------------------------------------------------------------------------

  // Spacing between needles in the magnetic field visualization
  needleSpacing: {
    type: 'number',
    defaultValue: 40,
    isValidValue: ( value: number ) => ( value > 0 )
  },

  // Length (tip to tip) of needles in the magnetic field visualization
  needleLength: {
    type: 'number',
    defaultValue: 25,
    isValidValue: ( value: number ) => ( value >= 20 && value <= 60 )
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