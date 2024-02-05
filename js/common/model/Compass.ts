// Copyright 2023-2024, University of Colorado Boulder

/**
 * Compass is the abstract base class for compass models.
 *
 * This is based on Compass.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Magnet from './Magnet.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Multilink from '../../../../axon/js/Multilink.js';
import FieldMeasurementTool, { FieldMeasurementToolOptions } from './FieldMeasurementTool.js';
import ConstantDtClock from './ConstantDtClock.js';

type SelfOptions = EmptySelfOptions;

export type CompassOptions = SelfOptions & FieldMeasurementToolOptions;

export default abstract class Compass extends FieldMeasurementTool {

  // The public API is readonly, while the internal API is read + write.
  public readonly angleProperty: TReadOnlyProperty<number>; // radians
  protected readonly _angleProperty: Property<number>;

  protected readonly magnet: Magnet;

  // A reusable vector instance, for getting the field vector value at the compass' position
  private readonly reusableFieldVector: Vector2;

  protected constructor( magnet: Magnet, isPlayingProperty: TReadOnlyProperty<boolean>, providedOptions: CompassOptions ) {

    const options = providedOptions;

    super( magnet, options );

    this.magnet = magnet;
    this.reusableFieldVector = new Vector2( 0, 0 );

    // This is not a DerivedProperty so that we can support kinematics in KinematicCompass.
    this._angleProperty = new NumberProperty( this.fieldVectorProperty.value.angle, {
      units: 'radians',
      tandem: options.tandem.createTandem( 'angleProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioDocumentation: 'Angle of the compass needle.'
    } );
    this.angleProperty = this._angleProperty;

    // If the clock is paused, update immediately to match the field vector.
    Multilink.multilink( [ this.fieldVectorProperty ], fieldVector => {
      if ( !isPlayingProperty.value && fieldVector.magnitude !== 0 ) {
        this._angleProperty.value = fieldVector.angle;
      }
    } );
  }

  public override reset(): void {
    super.reset();
    this._angleProperty.reset();
  }

  public step( dt: number ): void {
    assert && assert( dt === ConstantDtClock.CONSTANT_DT, `invalid dt=${dt}, see ConstantStepEmitter` );
    if ( this.fieldVectorProperty.value.magnitude !== 0 ) {
      this.updateAngle( this.fieldVectorProperty.value, dt );
    }
  }

  /**
   * Updates the compass needle's angle.
   * @param fieldVector - the magnet's B-field vector at the compass position
   * @param dt - time step, in seconds
   */
  protected abstract updateAngle( fieldVector: Vector2, dt: number ): void;

  /**
   * Starts the compass needle moving immediately.
   */
  public startMovingNow(): void {
    // The default behavior is to do nothing.
  }
}

faradaysElectromagneticLab.register( 'Compass', Compass );