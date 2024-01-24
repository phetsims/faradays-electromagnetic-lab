// Copyright 2023-2024, University of Colorado Boulder

/**
 * Transformer is the model of a transformer, consisting of 2 coils. The primary coil (an electromagnet)
 * creates a magnetic flow that induces current in the secondary coil (a pickup coil).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Electromagnet from '../../common/model/Electromagnet.js';
import PickupCoil from '../../common/model/PickupCoil.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { FixedSpacingSamplePointsStrategy } from '../../common/model/PickupCoilSamplePointsStrategy.js';

export default class Transformer extends PhetioObject {

  public readonly electromagnet: Electromagnet;
  public readonly pickupCoil: PickupCoil;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioState: false
    } );

    this.electromagnet = new Electromagnet( {
      position: new Vector2( 200, 400 ),
      tandem: tandem.createTandem( 'electromagnet' )
    } );

    this.pickupCoil = new PickupCoil( this.electromagnet, {
      position: new Vector2( 500, 400 ),
      maxEMF: 3500000, // see PickupCoil.calibrateMaxEMF
      transitionSmoothingScale: 0.56, // see PickupCoil.transitionSmoothingScaleProperty
      samplePointsStrategy: new FixedSpacingSamplePointsStrategy( 5.4 ), // same as Java version
      electronSpeedScale: 2,
      tandem: tandem.createTandem( 'pickupCoil' )
    } );
  }

  public reset(): void {
    this.electromagnet.reset();
    this.pickupCoil.reset();
  }

  public step( dt: number ): void {
    this.electromagnet.step( dt );
    this.pickupCoil.step( dt );
  }
}

faradaysElectromagneticLab.register( 'Transformer', Transformer );