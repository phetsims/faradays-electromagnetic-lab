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
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DCPowerSupply from '../../common/model/DCPowerSupply.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';

export default class Transformer extends PhetioObject {

  public readonly electromagnet: Electromagnet;
  public readonly pickupCoil: PickupCoil;

  public constructor( tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem,
      phetioFeatured: true, // ... so that featured linked element will appear in 'Featured' tree.
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
      coilOptions: {
        loopAreaPercentRange: new RangeWithValue( 20, 100, 75 ),
        electronSpeedScale: 2
      },
      lightBulbOptions: {
        lightsWhenCurrentChangesDirection: false
      },
      voltmeterOptions: {

        // Disable voltmeter kinematics when using the AC power supply for the electromagnet.
        kinematicsEnabledProperty: new DerivedProperty(
          [ this.electromagnet.currentSourceProperty ],
          currentSource => ( currentSource instanceof DCPowerSupply ) )
      },
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