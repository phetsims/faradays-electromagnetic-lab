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
import Compass from '../../common/model/Compass.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ImmediateCompass from '../../common/model/ImmediateCompass.js';

export default class BarMagnetModel implements TModel {

  public readonly barMagnet: BarMagnet;
  public readonly fieldMeter: FieldMeter;
  public readonly compass: Compass;

  public constructor( tandem: Tandem ) {

    this.barMagnet = new BarMagnet( {
      position: new Vector2( 450, 300 ),
      tandem: tandem.createTandem( 'barMagnet' )
    } );

    this.fieldMeter = new FieldMeter( this.barMagnet, {
      position: new Vector2( 150, 400 ),
      tandem: tandem.createTandem( 'fieldMeter' )
    } );

    //TODO should be KinematicCompass, but it's not working
    this.compass = new ImmediateCompass( this.barMagnet, {
      position: new Vector2( 150, 300 ),
      tandem: tandem.createTandem( 'compass' )
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.barMagnet.reset();
    this.fieldMeter.reset();
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