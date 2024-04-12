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
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { CurrentFlow } from '../../common/FELQueryParameters.js';

type SelfOptions = {
  electromagnetPosition: Vector2;
  pickupCoilPosition: Vector2;
};

type TransformerOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Transformer extends PhetioObject {

  public readonly electromagnet: Electromagnet;
  public readonly pickupCoil: PickupCoil;

  public constructor( currentFlowProperty: TReadOnlyProperty<CurrentFlow>, providedOptions: TransformerOptions ) {

    const options = optionize<TransformerOptions, SelfOptions, PhetioObjectOptions>()( {
      isDisposable: false,
      phetioFeatured: true, // ... so that featured linked element will appear in 'Featured' tree.
      phetioState: false
    }, providedOptions );

    super( options );

    this.electromagnet = new Electromagnet( currentFlowProperty, {
      position: options.electromagnetPosition,
      tandem: options.tandem.createTandem( 'electromagnet' )
    } );

    this.pickupCoil = new PickupCoil( this.electromagnet, currentFlowProperty, {
      position: options.pickupCoilPosition,
      maxEMF: 3500000, // see PickupCoil.calibrateMaxEMF
      transitionSmoothingScale: 0.56, // see PickupCoil.transitionSmoothingScaleProperty
      samplePointsStrategy: new FixedSpacingSamplePointsStrategy( 5.4 ), // same as Java version
      coilOptions: {
        loopAreaPercentRange: new RangeWithValue( 20, 100, 75 ),
        currentSpeedScale: 2
      },
      lightBulbOptions: {
        //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/152 document why
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

    // Ignore the EMF induced by switching power supplies. Do not do this when setting PhET-iO state because Property
    // changes made by clearEMF will be ignored, resulting in failure of clearEMF.
    // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/149.
    this.electromagnet.currentSourceProperty.lazyLink( () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.pickupCoil.clearEMF();
      }
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