// Copyright 2023-2024, University of Colorado Boulder

/**
 * Turbine is the model of a simple turbine. Water flow rotates a bar magnet, causing the magnetic field to modulate.
 *
 * This is based on Turbine.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import BarMagnet from '../../common/model/BarMagnet.js';
import ConstantDtClock from '../../common/model/ConstantDtClock.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import WaterFaucet from './WaterFaucet.js';

const RPM_RANGE = new Range( 0, 60 ); // RPMs

// Maximum change in angle per clock tick.
const MAX_DELTA_ANGLE = ( 2 * Math.PI ) * ( RPM_RANGE.max / ( ConstantDtClock.FRAMES_PER_SECOND * 60 ) );

// Range of the drag factor applied to the turbine caused by the pickup coil (unitless)
const DRAG_FACTOR_RANGE = new Range( 0, 0.2 );

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

  /**
   * @param position - center of the water wheel and bar magnet
   * @param tandem
   */
  public constructor( position: Vector2, tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem,
      phetioState: false
    } );

    this.barMagnet = new BarMagnet( {
      position: position,
      positionPropertyOptions: {
        phetioReadOnly: true
      },
      tandem: tandem.createTandem( 'barMagnet' )
    } );

    this.waterFaucet = new WaterFaucet( tandem.createTandem( 'waterFaucet' ) );

    this.dragFactorProperty = new NumberProperty( DRAG_FACTOR_RANGE.min, {
      range: DRAG_FACTOR_RANGE,
      tandem: tandem.createTandem( 'dragFactorProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Drag on the turbine caused by the pickup coil. For internal use only.'
    } );

    this.rpmProperty = new DerivedProperty( [ this.waterFaucet.flowRatePercentProperty, this.dragFactorProperty ],
      ( flowRatePercent, dragFactor ) => ( 1 - dragFactor ) * ( flowRatePercent / 100 ) * RPM_RANGE.max, {
        isValidValue: rpm => RPM_RANGE.contains( rpm ),
        units: 'rpm',
        tandem: tandem.createTandem( 'rpmProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true
      } );
  }

  public reset(): void {
    this.barMagnet.reset();
    this.waterFaucet.reset();
    // Do not reset this.dragFactorProperty because it is set by Generator.
  }

  public step( dt: number ): void {
    assert && assert( dt === ConstantDtClock.DT, `invalid dt=${dt}` );

    const flowRatePercent = this.waterFaucet.flowRatePercentProperty.value;

    if ( flowRatePercent !== 0 ) {

      // Determine the change in rotation angle.
      const deltaAngle = dt * ( flowRatePercent / 100 ) * MAX_DELTA_ANGLE;

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