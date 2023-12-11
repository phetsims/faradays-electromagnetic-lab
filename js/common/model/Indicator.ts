// Copyright 2023, University of Colorado Boulder

//TODO Give this a more descriptive name.

/**
 * Indicator is an enumeration of the types of EMF indicator for a pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const IndicatorValues = [ 'lightBulb', 'voltmeter' ] as const;
export type Indicator = ( typeof IndicatorValues )[number];