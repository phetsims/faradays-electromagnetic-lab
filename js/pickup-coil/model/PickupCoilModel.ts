// Copyright 2023-2024, University of Colorado Boulder

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
import KinematicCompass from '../../common/model/KinematicCompass.js';
import FELModel from '../../common/model/FELModel.js';
import { FixedSpacingSamplePointsStrategy } from '../../common/model/PickupCoilSamplePointsStrategy.js';

export default class PickupCoilModel extends FELModel {

  public readonly barMagnet: BarMagnet;
  public readonly pickupCoil: PickupCoil;
  public readonly compass: Compass;
  public readonly fieldMeter: FieldMeter;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem,
      isPlayingPropertyOptions: {
        tandem: Tandem.OPT_OUT // because this screen has no time controls
      }
    } );

    this.barMagnet = new BarMagnet( {
      position: new Vector2( 200, 400 ),
      tandem: tandem.createTandem( 'barMagnet' )
    } );

    this.pickupCoil = new PickupCoil( this.barMagnet, {
      position: new Vector2( 500, 400 ),
      maxEMF: 2700000, // see PickupCoil.calibrateMaxEMF
      transitionSmoothingScale: 0.77, // see PickupCoil.transitionSmoothingScaleProperty
      samplePointsStrategy: new FixedSpacingSamplePointsStrategy( this.barMagnet.size.height / 10 ),
      electronSpeedScale: 3,
      tandem: tandem.createTandem( 'pickupCoil' )
    } );

    this.compass = new KinematicCompass( this.barMagnet, this.isPlayingProperty, {
      position: new Vector2( 150, 300 ),
      visible: false,
      tandem: tandem.createTandem( 'compass' )
    } );

    this.fieldMeter = new FieldMeter( this.barMagnet, {
      position: new Vector2( 150, 400 ),
      visible: false,
      tandem: tandem.createTandem( 'fieldMeter' )
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
    this.compass.reset();
    this.fieldMeter.reset();
  }
}

faradaysElectromagneticLab.register( 'PickupCoilModel', PickupCoilModel );