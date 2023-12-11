// Copyright 2023, University of Colorado Boulder

//TODO delete anything here that ends up not being used
/**
 * FELQueryParameters defines the query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import RangeWithValue from '../../../dot/js/RangeWithValue.js';

export const MagneticUnitsValues = [ 'G', 'T' ] as const;
export type MagneticUnits = ( typeof MagneticUnitsValues )[number];

export const FIELD_SCALE_RANGE = new RangeWithValue( 1, 6, 2.7 );
export const LIGHT_BULB_GLOW_SCALE_RANGE = new RangeWithValue( 1, 100, 15 );

const SCHEMA_MAP = {

  //----------------------------------------------------------------------------------------------------------------
  // Public-facing query parameters
  //----------------------------------------------------------------------------------------------------------------

  // Magnetic units to be displayed
  magneticUnits: {
    type: 'string',
    defaultValue: 'G',
    validValues: MagneticUnitsValues,
    public: true
  },

  // Adds an "Earth" checkbox to screens where it is relevant.
  addEarthCheckbox: {
    type: 'boolean',
    defaultValue: true, //TODO default false
    public: true
  },

  //----------------------------------------------------------------------------------------------------------------
  // Internal query parameters
  //----------------------------------------------------------------------------------------------------------------

  // Spacing between needles in the magnetic field visualization
  needleSpacing: {
    type: 'number',
    defaultValue: 40,
    isValidValue: ( value: number ) => ( value >= 35 && value <= 100 )
  },

  // Length (tip to tip) of needles in the magnetic field visualization
  needleLength: {
    type: 'number',
    defaultValue: 25,
    isValidValue: ( value: number ) => ( value >= 20 && value <= 60 )
  },

  /**
   * Set the intensity scale for the B-field visualization. In reality, the B-field drops off very quickly as we move
   * away from the magnet, and we wouldn't be able to see very much of the field. So we scale the intensity of the
   * compass needles in our visualization so that we see more of the field. Smaller values make the field appear to
   * drop off more rapidly. Larger values make the field appear to drop off more slowly.
   */
  fieldScale: {
    type: 'number',
    defaultValue: FIELD_SCALE_RANGE.defaultValue,
    isValidValue: ( value: number ) => FIELD_SCALE_RANGE.contains( value )
  },

  /**
   * Scales the modulation of alpha, used to make the light bulb glow.
   */
  lightBulbScale: {
    type: 'number',
    defaultValue: LIGHT_BULB_GLOW_SCALE_RANGE.defaultValue,
    isValidValue: ( value: number ) => LIGHT_BULB_GLOW_SCALE_RANGE.contains( value )
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