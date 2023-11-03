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
import KinematicCompass from '../../common/model/KinematicCompass.js';
import Compass from '../../common/model/Compass.js';

export default class BarMagnetModel implements TModel {

  public readonly barMagnet: BarMagnet;
  public readonly compass: Compass;

  public constructor( tandem: Tandem ) {

    this.barMagnet = new BarMagnet( tandem.createTandem( 'barMagnet' ) );

    this.compass = new KinematicCompass( this.barMagnet, tandem.createTandem( 'compass' ) );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.barMagnet.reset();
    this.compass.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.compass.step( dt );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetModel', BarMagnetModel );