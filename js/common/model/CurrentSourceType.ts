// Copyright 2023, University of Colorado Boulder

/**
 * CurrentSourceType is an enumeration of the current sources for an electromagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const CurrentSourceValues = [ 'battery', 'acPowerSupply' ] as const;
export type CurrentSourceType = ( typeof CurrentSourceValues )[number];