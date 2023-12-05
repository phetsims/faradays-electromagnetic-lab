// Copyright 2023, University of Colorado Boulder

/**
 * TODO
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