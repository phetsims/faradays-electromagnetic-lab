// Copyright 2023, University of Colorado Boulder

/**
 * ElectromagnetModel is the top-level model for the 'Electromagnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class ElectromagnetModel implements TModel {

  public constructor( tandem: Tandem ) {
    //TODO
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetModel', ElectromagnetModel );