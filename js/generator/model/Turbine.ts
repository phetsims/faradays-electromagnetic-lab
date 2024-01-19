// Copyright 2023-2024, University of Colorado Boulder

/**
 * Turbine is the model of a simple turbine generator, where water flow rotates a bar magnet, causing the magnetic
 * field to modulate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BarMagnet, { BarMagnetOptions } from '../../common/model/BarMagnet.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Range from '../../../../dot/js/Range.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import FELModel from '../../common/model/FELModel.js';

const MAX_RPM = 100;
const WATER_FLOW_RATE_RANGE = new Range( 0, 100 ); // %
const RPM_RANGE = new Range( WATER_FLOW_RATE_RANGE.min * MAX_RPM / 100, WATER_FLOW_RATE_RANGE.max * MAX_RPM / 100 );

// Maximum change in angle per clock tick.
const MAX_DELTA_ANGLE = ( 2 * Math.PI ) * ( MAX_RPM / ( FELModel.FRAMES_PER_SECOND * 60 ) );

type SelfOptions = EmptySelfOptions;

export type TurbineOptions = SelfOptions & BarMagnetOptions;

export default class Turbine extends BarMagnet {

  // Flow rate of water that turns the turbine
  public readonly waterFlowRateProperty: NumberProperty;

  // Rotational speed of the turbine
  public readonly rpmProperty: TReadOnlyProperty<number>;

  public constructor( providedOptions: TurbineOptions ) {

    const options = providedOptions;

    super( options );

    this.waterFlowRateProperty = new NumberProperty( 0, {
      units: '%',
      range: WATER_FLOW_RATE_RANGE,
      tandem: options.tandem.createTandem( 'waterFlowRateProperty' ),
      phetioFeatured: true
    } );

    this.rpmProperty = new DerivedProperty( [ this.waterFlowRateProperty ],
      waterFlowRate => ( waterFlowRate / 100 ) * MAX_RPM, {
        isValidValue: rpm => RPM_RANGE.contains( rpm ),
        units: 'rpm',
        tandem: options.tandem.createTandem( 'rpmProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true
      } );
  }

  public override reset(): void {
    super.reset();
    this.waterFlowRateProperty.reset();
  }

  public step( dt: number ): void {
    assert && assert( dt === 1, `invalid dt=${dt}, see FELModel step` );
    if ( this.waterFlowRateProperty.value !== 0 ) {

      // Determine the change in rotation angle.
      const deltaAngle = dt * ( this.waterFlowRateProperty.value / 100 ) * MAX_DELTA_ANGLE;

      // Subtract to rotate counterclockwise.
      let newAngle = this.rotationProperty.value - deltaAngle;

      // Limit angles to [-360,+360] degrees.
      const sign = ( newAngle < 0 ) ? -1 : +1;
      newAngle = sign * ( Math.abs( newAngle ) % ( 2 * Math.PI ) );

      this.rotationProperty.value = newAngle;
    }
  }
}

faradaysElectromagneticLab.register( 'Turbine', Turbine );