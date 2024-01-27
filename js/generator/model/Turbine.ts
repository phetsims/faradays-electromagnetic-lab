// Copyright 2023-2024, University of Colorado Boulder

/**
 * Turbine is the model of a simple turbine generator, where water flow rotates a bar magnet, causing the magnetic
 * field to modulate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BarMagnet from '../../common/model/BarMagnet.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Range from '../../../../dot/js/Range.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import FELModel from '../../common/model/FELModel.js';
import WaterFaucet from './WaterFaucet.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const MAX_RPM = 100;

// Maximum change in angle per clock tick.
const MAX_DELTA_ANGLE = ( 2 * Math.PI ) * ( MAX_RPM / ( FELModel.FRAMES_PER_SECOND * 60 ) );

export default class Turbine extends PhetioObject {

  // Bar magnet that rotates as the turbine spins
  public readonly barMagnet: BarMagnet;

  // Water flowing from this faucet rotates the magnet
  public readonly waterFaucet: WaterFaucet;

  // Rotational speed of the magnet
  public readonly rpmProperty: TReadOnlyProperty<number>;

  public constructor( tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem,
      phetioState: false
    } );

    this.barMagnet = new BarMagnet( {
      position: new Vector2( 285, 400 ),
      positionPropertyOptions: {
        phetioReadOnly: true
      },
      tandem: tandem.createTandem( 'barMagnet' )
    } );

    this.waterFaucet = new WaterFaucet( tandem.createTandem( 'waterFaucet' ) );

    const flowRateRange = this.waterFaucet.flowRateProperty.range;
    const rpmRange = new Range( ( flowRateRange.min / 100 ) * MAX_RPM, ( flowRateRange.max / 100 ) * MAX_RPM );

    this.rpmProperty = new DerivedProperty( [ this.waterFaucet.flowRateProperty ],
      flowRate => ( flowRate / 100 ) * MAX_RPM, {
        isValidValue: rpm => rpmRange.contains( rpm ),
        units: 'rpm',
        tandem: tandem.createTandem( 'rpmProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true
      } );
  }

  public reset(): void {
    this.barMagnet.reset();
    this.waterFaucet.reset();
  }

  public step( dt: number ): void {
    assert && assert( dt === 1, `invalid dt=${dt}, see FELModel step` );
    const flowRate = this.waterFaucet.flowRateProperty.value;
    if ( flowRate !== 0 ) {

      // Determine the change in rotation angle.
      const deltaAngle = dt * ( flowRate / 100 ) * MAX_DELTA_ANGLE;

      // Subtract to rotate counterclockwise.
      let newAngle = this.barMagnet.rotationProperty.value - deltaAngle;

      // Limit angles to [-360,+360] degrees.
      const sign = ( newAngle < 0 ) ? -1 : +1;
      newAngle = sign * ( Math.abs( newAngle ) % ( 2 * Math.PI ) );

      this.barMagnet.rotationProperty.value = newAngle;
    }
  }
}

faradaysElectromagneticLab.register( 'Turbine', Turbine );