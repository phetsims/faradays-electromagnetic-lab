// Copyright 2023-2024, University of Colorado Boulder

/**
 * Turbine is the model of a simple turbine generator, where water flow rotates a bar magnet, causing the magnetic
 * field to modulate.
 *
 * This is based on Turbine.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BarMagnet from '../../common/model/BarMagnet.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Range from '../../../../dot/js/Range.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import WaterFaucet from './WaterFaucet.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ConstantDtClock from '../../common/model/ConstantDtClock.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import FELQueryParameters from '../../common/FELQueryParameters.js';

const MAX_RPM = 100;

// Maximum change in angle per clock tick.
const MAX_DELTA_ANGLE = ( 2 * Math.PI ) * ( MAX_RPM / ( ConstantDtClock.FRAMES_PER_SECOND * 60 ) );

export default class Turbine extends PhetioObject {

  // Bar magnet that rotates as the turbine spins
  public readonly barMagnet: BarMagnet;

  // Water flowing from this faucet rotates the magnet
  public readonly waterFaucet: WaterFaucet;

  // Drag (or "back EMF") due to the pickup coil. This was not a feature in the Java version.
  // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/11
  public readonly dragFactorProperty: NumberProperty;

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

    this.dragFactorProperty = new NumberProperty( 0, {
      range: new Range( 0, FELQueryParameters.turbineDragFactor ),
      tandem: tandem.createTandem( 'dragFactorProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Drag on the turbine caused by the pickup coil.'
    } );

    const rpmRange = new Range( ( flowRateRange.min / 100 ) * MAX_RPM, ( flowRateRange.max / 100 ) * MAX_RPM );
    this.rpmProperty = new DerivedProperty( [ this.waterFaucet.flowRateProperty, this.dragFactorProperty ],
      ( flowRate, dragFactor ) => ( 1 - dragFactor ) * ( flowRate / 100 ) * MAX_RPM, {
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
    // Do not reset this.dragFactorProperty
  }

  public step( dt: number ): void {
    assert && assert( dt === ConstantDtClock.CONSTANT_DT, `invalid dt=${dt}, see ConstantDtClock` );
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