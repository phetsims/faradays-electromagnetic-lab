// Copyright 2023-2024, University of Colorado Boulder

/**
 * Transformer is the model of a transformer, consisting of 2 coils. The primary coil (an electromagnet)
 * creates a magnetic flow that induces EMF in the secondary coil (a pickup coil).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Electromagnet from '../../common/model/Electromagnet.js';
import PickupCoil from '../../common/model/PickupCoil.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { FixedSpacingSamplePointsStrategy } from '../../common/model/PickupCoilSamplePointsStrategy.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DCPowerSupply from '../../common/model/DCPowerSupply.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ConstantDtClock from '../../common/model/ConstantDtClock.js';

type SelfOptions = {
  electromagnetPosition: Vector2;
  pickupCoilPosition: Vector2;
};

type TransformerOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Transformer extends PhetioObject {

  public readonly electromagnet: Electromagnet;
  public readonly pickupCoil: PickupCoil;

  public constructor( providedOptions: TransformerOptions ) {

    const options = optionize<TransformerOptions, SelfOptions, PhetioObjectOptions>()( {
      isDisposable: false,
      phetioFeatured: true, // ... so that featured linked element will appear in 'Featured' tree.
      phetioState: false
    }, providedOptions );

    super( options );

    this.electromagnet = new Electromagnet( {
      position: options.electromagnetPosition,
      tandem: options.tandem.createTandem( 'electromagnet' )
    } );

    this.pickupCoil = new PickupCoil( this.electromagnet, {
      position: options.pickupCoilPosition,
      maxEMF: 3500000, // see PickupCoil.calibrateMaxEMF
      transitionSmoothingScale: 0.56, // see PickupCoil.transitionSmoothingScaleProperty
      samplePointsStrategy: new FixedSpacingSamplePointsStrategy( 5.4 ), // same as Java version
      coilOptions: {
        loopAreaPercentRange: new RangeWithValue( 20, 100, 75 ),
        electronSpeedScale: 2
      },
      lightBulbOptions: {
        //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/152 Is this appropriate for the DC power supply?
        lightsWhenCurrentChangesDirection: false
      },
      voltmeterOptions: {

        // Disable voltmeter kinematics for the AC power supply. Immediate response is needed, due to the cyclic nature.
        kinematicsEnabledProperty: new DerivedProperty(
          [ this.electromagnet.currentSourceProperty ],
          currentSource => ( currentSource instanceof DCPowerSupply ) )
      },
      tandem: options.tandem.createTandem( 'pickupCoil' )
    } );

    // Workaround for https://github.com/phetsims/faradays-electromagnetic-lab/issues/92, to ignore the EMF induced
    // by switching power supplies. Step the pickup coil twice, so that there is effectively no induced EMF.
    this.electromagnet.currentSourceProperty.lazyLink( () => {
      this.pickupCoil.step( ConstantDtClock.DT ); // EMF may be induced by changing from oldCurrentSource to newCurrentSource.
      this.pickupCoil.step( ConstantDtClock.DT ); // No EMF is induced because there is no flux change in newCurrentSource.
      assert && assert( this.pickupCoil.emfProperty.value === 0, `unexpected emfProperty.value: ${this.pickupCoil.emfProperty.value}` );
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