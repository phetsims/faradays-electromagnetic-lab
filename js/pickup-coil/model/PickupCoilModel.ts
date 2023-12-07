// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoilModel is the top-level model for the 'Pickup Coil' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PickupCoil, { FixedSpacingSamplePointsStrategy } from '../../common/model/PickupCoil.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BarMagnet from '../../common/model/BarMagnet.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Compass from '../../common/model/Compass.js';
import KinematicCompass from '../../common/model/KinematicCompass.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import LightBulb from '../../common/model/LightBulb.js';
import FELModel from '../../common/model/FELModel.js';

export default class PickupCoilModel extends FELModel {

  public readonly barMagnet: BarMagnet;
  public readonly pickupCoil: PickupCoil;
  public readonly lightBulb: LightBulb;
  public readonly fieldMeter: FieldMeter;
  public readonly compass: Compass;

  public constructor( tandem: Tandem ) {

    super( tandem );

    this.barMagnet = new BarMagnet( {
      strengthRange: new RangeWithValue( 0, 300, 225 ), // gauss
      position: new Vector2( 450, 300 ),
      tandem: tandem.createTandem( 'barMagnet' )
    } );

    this.pickupCoil = new PickupCoil( this.barMagnet, {
      position: new Vector2( 500, 400 ),
      maxEMF: 2700000,
      transitionSmoothingScale: 0.77,
      electronSpeedScale: 3,
      samplePointsStrategy: new FixedSpacingSamplePointsStrategy( this.barMagnet.size.height / 10 ),
      tandem: tandem.createTandem( 'pickupCoil' )
    } );

    this.lightBulb = new LightBulb( this.pickupCoil, tandem.createTandem( 'lightBulb' ) );

    this.fieldMeter = new FieldMeter( this.barMagnet, {
      position: new Vector2( 150, 400 ),
      tandem: tandem.createTandem( 'fieldMeter' )
    } );

    this.compass = new KinematicCompass( this.barMagnet, {
      position: new Vector2( 150, 300 ),
      visible: false,
      tandem: tandem.createTandem( 'compass' )
    } );

    this.stepEmitter.addListener( dt => {
      this.pickupCoil.step( dt );
      this.compass.step( dt );
    } );
  }

  public override reset(): void {
    super.reset();
    this.barMagnet.reset();
    this.pickupCoil.reset();
    this.fieldMeter.reset();
    this.compass.reset();
  }
}

faradaysElectromagneticLab.register( 'PickupCoilModel', PickupCoilModel );