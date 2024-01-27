// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELModel is the base class for all top-level models in the simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TModel from '../../../../joist/js/TModel.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import BooleanProperty, { BooleanPropertyOptions } from '../../../../axon/js/BooleanProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import FieldMeter, { FieldMeterOptions } from './FieldMeter.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Magnet from './Magnet.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

const DEFAULT_FIELD_METER_POSITION = new Vector2( 150, 400 );

type SelfOptions = {

  // Options passed to isPlayingProperty
  isPlayingPropertyOptions?: BooleanPropertyOptions;

  // Options passed to FieldMeter
  fieldMeterOptions?: PickOptional<FieldMeterOptions, 'position' | 'visible'>;
};

export type FELModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class FELModel implements TModel {

  // Constant dt (per frame) that the step method was designed to support in the Java version.
  public static readonly CONSTANT_DT = 1;

  // Frame rate that the step method was designed to support in the Java version.
  public static readonly FRAMES_PER_SECOND = 25;
  private static readonly SECONDS_PER_FRAME = 1 / FELModel.FRAMES_PER_SECOND;

  // Whether time is progressing in the sim
  public readonly isPlayingProperty: Property<boolean>;

  // Accumulated time since stepEmitter fired, to maintain consistent framerate
  private readonly accumulatedTimeProperty: Property<number>;

  // Fires at a constant rate, with a constant dt. Subclass should listen to this instead of overriding step.
  public readonly stepEmitter: Emitter<[ number ]>;

  public readonly fieldMeter: FieldMeter;

  protected constructor( magnet: Magnet, providedOptions: FELModelOptions ) {

    const options = optionize<FELModelOptions, StrictOmit<SelfOptions, 'isPlayingPropertyOptions' | 'fieldMeterOptions'>>()( {}, providedOptions );

    this.isPlayingProperty = new BooleanProperty( true, combineOptions<BooleanPropertyOptions>( {
      tandem: options.tandem.createTandem( 'isPlayingProperty' )
    }, options.isPlayingPropertyOptions ) );

    this.accumulatedTimeProperty = new NumberProperty( 0, {
      units: 's',
      tandem: options.tandem.createTandem( 'accumulatedTimeProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Time since stepEmitter last fired. For internal use only.',
      phetioHighFrequency: true
    } );

    //TODO Does stepEmitter need to be instrumented? If so, should it be phetioHighFrequency:true?
    this.stepEmitter = new Emitter( {
      parameters: [
        { name: 'dt', phetioType: NumberIO }
      ],
      tandem: options.tandem.createTandem( 'stepEmitter' ),
      phetioReadOnly: true, // ... so that PhET-iO clients cannot call emit
      phetioDocumentation: 'Fires when the model is to be stepped.',
      phetioHighFrequency: true
    } );

    this.fieldMeter = new FieldMeter( magnet, combineOptions<FieldMeterOptions>( {
      position: DEFAULT_FIELD_METER_POSITION,
      visible: false,
      tandem: options.tandem.createTandem( 'fieldMeter' )
    }, options.fieldMeterOptions ) );
  }

  public reset(): void {
    this.isPlayingProperty.reset();
    this.accumulatedTimeProperty.reset();
    this.fieldMeter.reset();
  }

  /**
   * In the Java version, we used a clock that fired 25 times per second, with constant dt = 1.
   * See FaradayModule.java: new SwingClock( 1000 / 25, FaradayConstants.CLOCK_STEP )
   * Because so much of the code relies on this, we implement something similar here.
   * Subclasses should not override step, and should instead listen to stepEmitter.
   *
   * @param dt - time change, in seconds
   */
  public step( dt: number ): void {
    if ( this.isPlayingProperty.value ) {
      this.accumulatedTimeProperty.value += dt;
      if ( this.accumulatedTimeProperty.value > FELModel.SECONDS_PER_FRAME ) {
        this.accumulatedTimeProperty.value -= FELModel.SECONDS_PER_FRAME;
        this.stepOnce();
      }
    }
  }

  public stepOnce(): void {
    this.stepEmitter.emit( FELModel.CONSTANT_DT );
  }
}

faradaysElectromagneticLab.register( 'FELModel', FELModel );