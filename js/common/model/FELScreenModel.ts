// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELScreenModel is the base class for all top-level models in the simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TModel from '../../../../joist/js/TModel.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty, { BooleanPropertyOptions } from '../../../../axon/js/BooleanProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import FieldMeter, { FieldMeterOptions } from './FieldMeter.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Magnet from './Magnet.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Compass from './Compass.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ConstantDtClock from './ConstantDtClock.js';

const DEFAULT_FIELD_METER_POSITION = new Vector2( 150, 400 );

type SelfOptions = {

  // Options passed to FieldMeter
  fieldMeterOptions?: PickOptional<FieldMeterOptions, 'position' | 'visible'>;

  // Creates a compass that is appropriate for the screen
  createCompass: ( magnet: Magnet, isPlayingProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) => Compass;

  // Options passed to isPlayingProperty
  isPlayingPropertyOptions?: BooleanPropertyOptions;
};

export type FELModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class FELScreenModel implements TModel {

  // Whether time is progressing in the sim
  public readonly isPlayingProperty: Property<boolean>;

  // Fires at a constant rate, with a constant dt, as required by most of the model code ported from Java.
  // Subclasses should listen to this instead of overriding step.
  public readonly clock: ConstantDtClock;

  // Devices that measure the magnet's B-field
  public readonly fieldMeter: FieldMeter;
  public readonly compass: Compass;

  protected constructor( magnet: Magnet, providedOptions: FELModelOptions ) {

    const options = optionize<FELModelOptions, StrictOmit<SelfOptions, 'isPlayingPropertyOptions' | 'fieldMeterOptions'>>()( {}, providedOptions );

    this.isPlayingProperty = new BooleanProperty( true, combineOptions<BooleanPropertyOptions>( {
      tandem: options.tandem.createTandem( 'isPlayingProperty' )
    }, options.isPlayingPropertyOptions ) );

    this.clock = new ConstantDtClock();

    this.fieldMeter = new FieldMeter( magnet, combineOptions<FieldMeterOptions>( {
      position: DEFAULT_FIELD_METER_POSITION,
      visible: false,
      tandem: options.tandem.createTandem( 'fieldMeter' )
    }, options.fieldMeterOptions ) );

    this.compass = options.createCompass( magnet, this.isPlayingProperty, options.tandem.createTandem( 'compass' ) );

    this.clock.addListener( dt => this.compass.step( dt ) );
  }

  public reset(): void {
    this.isPlayingProperty.reset();
    this.fieldMeter.reset();
    this.compass.reset();
  }

  /**
   * DO NOT OVERRIDE! Subclasses should not override step, and should instead listen to this.clock.
   * See documentation in ConstantDtClock.ts.
   *
   * @param dt - time change, in seconds
   */
  public step( dt: number ): void {
    if ( this.isPlayingProperty.value ) {
      this.clock.step( dt );
    }
  }
}

faradaysElectromagneticLab.register( 'FELScreenModel', FELScreenModel );