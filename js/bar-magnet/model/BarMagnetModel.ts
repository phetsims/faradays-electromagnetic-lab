// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetModel is the top-level model for the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnet from '../../common/model/BarMagnet.js';

export default class BarMagnetModel implements TModel {

  public readonly barMagnet: BarMagnet;

  public constructor( tandem: Tandem ) {

    this.barMagnet = new BarMagnet( tandem.createTandem( 'barMagnet' ) );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.barMagnet.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO
  }
}

faradaysElectromagneticLab.register( 'BarMagnetModel', BarMagnetModel );