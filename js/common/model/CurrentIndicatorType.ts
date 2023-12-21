// Copyright 2023, University of Colorado Boulder

/**
 * CurrentIndicatorType is an enumeration of the devices for detecting current in a pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const CurrentIndicatorValues = [ 'lightBulb', 'voltmeter' ] as const;
export type CurrentIndicatorType = ( typeof CurrentIndicatorValues )[number];