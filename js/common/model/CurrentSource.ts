// Copyright 2023, University of Colorado Boulder

/**
 * CurrentSource is an enumeration of the current sources for an electromagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const CurrentSourceValues = [ 'battery', 'acPowerSupply' ] as const;
export type CurrentSource = ( typeof CurrentSourceValues )[number];