// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoilModel is the top-level model for the 'Pickup Coil' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PickupCoil from '../../common/model/PickupCoil.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BarMagnet from '../../common/model/BarMagnet.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Compass from '../../common/model/Compass.js';
import TModel from '../../../../joist/js/TModel.js';
import KinematicCompass from '../../common/model/KinematicCompass.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';

export default class PickupCoilModel implements TModel {

  public readonly barMagnet: BarMagnet;
  public readonly pickupCoil: PickupCoil;
  public readonly fieldMeter: FieldMeter;
  public readonly compass: Compass;

  public constructor( tandem: Tandem ) {

    this.barMagnet = new BarMagnet( {
      strengthRange: new RangeWithValue( 0, 300, 225 ), // gauss
      position: new Vector2( 450, 300 ),
      tandem: tandem.createTandem( 'barMagnet' )
    } );

    this.pickupCoil = new PickupCoil( this.barMagnet, {
      position: new Vector2( 500, 400 ),
      calibrationEMF: 2700000, //TODO see calibrateEmf in PickupCoil.java
      transitionSmoothingScale: 0.77, //TODO see setTransitionSmoothingScale in PickupCoil.java
      tandem: tandem.createTandem( 'pickupCoil' )
    } );

    this.fieldMeter = new FieldMeter( this.barMagnet, {
      position: new Vector2( 150, 400 ),
      tandem: tandem.createTandem( 'fieldMeter' )
    } );

    this.compass = new KinematicCompass( this.barMagnet, {
      position: new Vector2( 150, 300 ),
      tandem: tandem.createTandem( 'compass' )
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.barMagnet.reset();
    this.pickupCoil.reset();
    this.fieldMeter.reset();
    this.compass.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO this.pickupCoil.step( dt );
    this.compass.step( dt );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilModel', PickupCoilModel );