// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELScreenModel is the base class for all top-level models in the simulation.
 *
 * Note that this class name is FELScreenModel instead of the typical FELModel, because all subclasses are named
 * {ScreenName}ScreenModel to avoid confusion with model elements that have the same names as screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty, { BooleanPropertyOptions } from '../../../../axon/js/BooleanProperty.js';
import Disposable from '../../../../axon/js/Disposable.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { MagneticUnits } from '../FELQueryParameters.js';
import Compass from './Compass.js';
import ConstantDtClock from './ConstantDtClock.js';
import FieldMeter, { FieldMeterOptions } from './FieldMeter.js';
import Magnet from './Magnet.js';

const DEFAULT_FIELD_METER_POSITION = new Vector2( 125, 400 );

type SelfOptions = {

  // Creates a compass that is appropriate for the screen
  createCompass: ( magnet: Magnet, isPlayingProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) => Compass;

  // Options passed to FieldMeter
  fieldMeterOptions?: PickOptional<FieldMeterOptions, 'position' | 'visible'>;

  // Options passed to isPlayingProperty
  isPlayingPropertyOptions?: PickOptional<BooleanPropertyOptions, 'tandem'>;
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

  protected constructor( magnet: Magnet, magneticUnitsProperty: TReadOnlyProperty<MagneticUnits>, providedOptions: FELModelOptions ) {

    const options = optionize<FELModelOptions, StrictOmit<SelfOptions, 'fieldMeterOptions' | 'isPlayingPropertyOptions'>>()( {}, providedOptions );

    this.isPlayingProperty = new BooleanProperty( true, combineOptions<BooleanPropertyOptions>( {
      tandem: options.tandem.createTandem( 'isPlayingProperty' ),
      phetioFeatured: true
    }, options.isPlayingPropertyOptions ) );

    this.clock = new ConstantDtClock();

    this.fieldMeter = new FieldMeter( magnet, magneticUnitsProperty, combineOptions<FieldMeterOptions>( {
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

  public dispose(): void {
    Disposable.assertNotDisposable();
  }
}

faradaysElectromagneticLab.register( 'FELScreenModel', FELScreenModel );