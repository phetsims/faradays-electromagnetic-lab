// Copyright 2023, University of Colorado Boulder

/**
 * Turbine is the model of a simple turbine generator, where fluid flow rotates a bar magnet.
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

// maximum rotations per minute (RPM)
const MAX_RPM = 100;

// Maximum change in angle per clock tick.
const MAX_DELTA_ANGLE = ( 2 * Math.PI ) * ( MAX_RPM / ( FELModel.FRAMES_PER_SECOND * 60 ) );

type SelfOptions = EmptySelfOptions;

export type TurbineOptions = SelfOptions & BarMagnetOptions;

export default class Turbine extends BarMagnet {

  public readonly speedProperty: NumberProperty;
  public readonly rpmProperty: TReadOnlyProperty<number>;

  public constructor( providedOptions: TurbineOptions ) {

    const options = providedOptions;

    super( options );

    this.speedProperty = new NumberProperty( 0, {
      range: new Range( -1, 1 ),
      tandem: options.tandem.createTandem( 'speedProperty' ),
      phetioFeatured: true
    } );

    this.rpmProperty = new DerivedProperty( [ this.speedProperty ], speed => Math.abs( speed * MAX_RPM ), {
      tandem: options.tandem.createTandem( 'rpmProperty' ),
      phetioValueType: NumberIO,
      phetioFeatured: true
    } );
  }

  public override reset(): void {
    super.reset();
    this.speedProperty.reset();
  }

  public step( dt: number ): void {
    assert && assert( dt === 1, `invalid dt=${dt}, see FELModel step` );
    if ( this.speedProperty.value !== 0 ) {

      // Determine the new rotation angle
      const deltaAngle = dt * this.speedProperty.value * MAX_DELTA_ANGLE;
      let newAngle = this.rotationProperty.value + deltaAngle;

      // Limit angles to [-360,+360] degrees.
      const sign = ( newAngle < 0 ) ? -1 : +1;
      newAngle = sign * ( Math.abs( newAngle ) % ( 2 * Math.PI ) );

      this.rotationProperty.value = newAngle;
    }
  }
}

faradaysElectromagneticLab.register( 'Turbine', Turbine );