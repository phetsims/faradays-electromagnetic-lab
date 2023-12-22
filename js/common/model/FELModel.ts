// Copyright 2023, University of Colorado Boulder

/**
 * FELModel is the abstract base class for all top-level models in the simulation.  It implements a
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TModel from '../../../../joist/js/TModel.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import optionize from '../../../../phet-core/js/optionize.js';

const DT_PER_FRAME = 1; // dt that step was designed to support

type SelfOptions = {

  // Screens that do not have a time control should set this to false.
  isPlayingPropertyInstrumented?: boolean;
};

export type FELModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class FELModel implements TModel {

  // Frame rate that step method was designed to support in the Java version.
  public static readonly FRAMES_PER_SECOND = 25;

  // Whether time is progressing in the sim
  public readonly isPlayingProperty: Property<boolean>;

  // Accumulated dt since the most recent call to this.step, to maintain consistent framerate
  private accumulatedDtProperty: Property<number>;

  // Fires at a constant rate, with a constant dt. Subclass should listen to this instead of overriding step.
  public readonly stepEmitter: Emitter<[ number ]>;

  protected constructor( providedOptions: FELModelOptions ) {

    const options = optionize<FELModelOptions, SelfOptions>()( {

      // SelfOptions
      isPlayingPropertyInstrumented: true
    }, providedOptions );

    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: options.isPlayingPropertyInstrumented ? options.tandem.createTandem( 'isPlayingProperty' ) : Tandem.OPT_OUT
    } );

    this.accumulatedDtProperty = new NumberProperty( 0, {
      units: 's',
      tandem: options.tandem.createTandem( 'accumulatedDtProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );

    this.stepEmitter = new Emitter( {
      tandem: options.tandem.createTandem( 'stepEmitter' ),
      phetioReadOnly: true, //TODO Is the relevant for an Emitter? Does it prevent clients from calling emit?
      parameters: [
        { name: 'dt', phetioType: NumberIO }
      ]
    } );
  }

  public reset(): void {
    this.isPlayingProperty.reset();
    this.accumulatedDtProperty.reset();
  }

  //TODO Should I actually port SwingClock?
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
      this.accumulatedDtProperty.value += dt;
      if ( this.accumulatedDtProperty.value > 1 / FELModel.FRAMES_PER_SECOND ) {
        this.accumulatedDtProperty.value -= 1 / FELModel.FRAMES_PER_SECOND;
        this.stepOnce();
      }
    }
  }

  public stepOnce(): void {
    this.stepEmitter.emit( DT_PER_FRAME );
  }
}

faradaysElectromagneticLab.register( 'FELModel', FELModel );