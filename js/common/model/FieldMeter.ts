// Copyright 2023, University of Colorado Boulder

/**
 * FieldMeter is the model of a meter for measuring the B-field at a specific position.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Magnet from './Magnet.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = {
  position?: Vector2; // initial value of positionProperty, unitless
};

export type FieldMeterOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class FieldMeter extends PhetioObject {

  public readonly positionProperty: Property<Vector2>; // unitless
  public readonly fieldVectorProperty: TReadOnlyProperty<Vector2>; // gauss

  // For PhET-iO, quantities displayed by the field meter
  public readonly BProperty: TReadOnlyProperty<number>;
  public readonly BxProperty: TReadOnlyProperty<number>;
  public readonly ByProperty: TReadOnlyProperty<number>;
  public readonly thetaProperty: TReadOnlyProperty<number>;

  public constructor( magnet: Magnet, providedOptions: FieldMeterOptions ) {

    const options = optionize<FieldMeterOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false
    }, providedOptions );

    super( options );

    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.fieldVectorProperty = new DerivedProperty(
      [ this.positionProperty, magnet.positionProperty, magnet.rotationProperty, magnet.strengthProperty ],
      ( position, rotation, strength ) => magnet.getFieldVector( position ), {
        units: 'G',
        tandem: options.tandem.createTandem( 'fieldVectorProperty' ),
        phetioValueType: Vector2.Vector2IO
      } );

    this.BProperty = new DerivedProperty( [ this.fieldVectorProperty ], fieldVector => fieldVector.magnitude, {
      units: 'G',
      tandem: options.tandem.createTandem( 'BProperty' ),
      phetioValueType: NumberIO,
      phetioDocumentation: 'magnitude of the field vector at the meter position'
    } );

    this.BxProperty = new DerivedProperty( [ this.fieldVectorProperty ], fieldVector => fieldVector.x, {
      units: 'G',
      tandem: options.tandem.createTandem( 'BxProperty' ),
      phetioValueType: NumberIO,
      phetioDocumentation: 'x component of the field vector at the meter position'
    } );

    this.ByProperty = new DerivedProperty( [ this.fieldVectorProperty ], fieldVector => fieldVector.y, {
      units: 'G',
      tandem: options.tandem.createTandem( 'ByProperty' ),
      phetioValueType: NumberIO,
      phetioDocumentation: 'y component of the field vector at the meter position'
    } );

    this.thetaProperty = new DerivedProperty( [ this.fieldVectorProperty ], fieldVector => fieldVector.angle, {
      units: 'radians',
      tandem: options.tandem.createTandem( 'thetaProperty' ),
      phetioValueType: NumberIO,
      phetioDocumentation: 'angle of the field vector at the meter position'
    } );

    //TODO debug and delete
    // this.fieldVectorProperty.link( fieldVector => {
    //   console.log( `fieldVector=${fieldVector}\nfieldMeter.position=${this.positionProperty.value}\nmagnet.position=${magnet.positionProperty.value}` )
    // } );
  }

  public reset(): void {
    this.positionProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'FieldMeter', FieldMeter );

