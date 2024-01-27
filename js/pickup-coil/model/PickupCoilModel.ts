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
import Compass from '../../common/model/Compass.js';
import KinematicCompass from '../../common/model/KinematicCompass.js';
import FELModel from '../../common/model/FELModel.js';
import { FixedSpacingSamplePointsStrategy } from '../../common/model/PickupCoilSamplePointsStrategy.js';

export default class PickupCoilModel extends FELModel {

  public readonly barMagnet: BarMagnet;
  public readonly pickupCoil: PickupCoil;
  public readonly compass: Compass;

  public constructor( tandem: Tandem ) {

    const barMagnet = new BarMagnet( {
      position: new Vector2( 200, 400 ),
      tandem: tandem.createTandem( 'barMagnet' )
    } );

    super( barMagnet, {
      tandem: tandem,
      isPlayingPropertyOptions: {
        tandem: Tandem.OPT_OUT // because this screen has no time controls
      }
    } );

    this.barMagnet = barMagnet;

    this.pickupCoil = new PickupCoil( barMagnet, {
      position: new Vector2( 500, 400 ),
      maxEMF: 2700000, // see PickupCoil.calibrateMaxEMF
      transitionSmoothingScale: 0.77, // see PickupCoil.transitionSmoothingScaleProperty
      samplePointsStrategy: new FixedSpacingSamplePointsStrategy( barMagnet.size.height / 10 ),
      coilOptions: {
        electronSpeedScale: 3
      },
      tandem: tandem.createTandem( 'pickupCoil' )
    } );

    this.compass = new KinematicCompass( barMagnet, this.isPlayingProperty, {
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
    this.compass.reset();
  }
}

faradaysElectromagneticLab.register( 'PickupCoilModel', PickupCoilModel );