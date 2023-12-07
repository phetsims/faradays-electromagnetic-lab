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
import Tandem from '../../../../tandem/js/Tandem.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

const SECONDS_PER_FRAME = 1 / 25; // framerate that step was designed to support
const DT_PER_FRAME = 1; // dt that step was designed to support

export default class FELModel implements TModel {

  // Accumulated dt since the most recent call to this.step, to maintain consistent framerate
  private accumulatedDtProperty: Property<number>;

  // Fires at a constant rate, with a constant dt. Subclass should listen to this instead of overriding step.
  public readonly stepEmitter: Emitter<[ number ]>;

  protected constructor( tandem: Tandem ) {

    this.accumulatedDtProperty = new NumberProperty( 0, {
      units: 's',
      tandem: tandem.createTandem( 'accumulatedDtProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );

    this.stepEmitter = new Emitter( {
      tandem: tandem.createTandem( 'stepEmitter' ),
      phetioReadOnly: true, //TODO Is the relevant for an Emitter? Does it prevent clients from calling emit?
      parameters: [
        { name: 'dt', phetioType: NumberIO }
      ]
    } );
  }

  public reset(): void {
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
    this.accumulatedDtProperty.value += dt;
    if ( this.accumulatedDtProperty.value > SECONDS_PER_FRAME ) {
      this.accumulatedDtProperty.value -= SECONDS_PER_FRAME;
      this.stepEmitter.emit( DT_PER_FRAME );
    }
  }
}

faradaysElectromagneticLab.register( 'FELModel', FELModel );