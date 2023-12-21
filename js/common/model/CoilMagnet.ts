// Copyright 2023, University of Colorado Boulder

/**
 * CoilMagnet is the base class for magnets that can be modeled as a coil. The shape of the model is a circle, and
 * the calculation of the magnetic field at some point of interest varies depending on whether the point is inside
 * or outside the circle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Magnet, { MagnetOptions } from './Magnet.js';

type SelfOptions = {
  //TODO
};

export type CoilMagnetOptions = SelfOptions & MagnetOptions;

export default abstract class CoilMagnet extends Magnet {

  protected constructor( providedOptions: CoilMagnetOptions ) {
    super( providedOptions );
    //TODO
  }
}

faradaysElectromagneticLab.register( 'CoilMagnet', CoilMagnet );