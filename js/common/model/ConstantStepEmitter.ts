// Copyright 2024, University of Colorado Boulder

/**
 * ConstantStepEmitter implements a constant dt clock, like PhET had in Java simulations. It fires at a constant
 * framerate, with a constant dt on each step.
 *
 * In the Java version of this sim, we used a clock that fires 25 times per second, with constant dt = 1.
 * See FaradayModule.java: new SwingClock( 1000 / 25, 1 )
 * Because so much of the code ported from Java relies on this, we implement something similar here.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

export default class ConstantStepEmitter extends Emitter<[ number ]> {

  // Constant dt (per frame) that the step method was designed to support in the Java version.
  public static readonly CONSTANT_DT = 1;

  // Frame rate that the step method was designed to support in the Java version.
  public static readonly FRAMES_PER_SECOND = 25;
  private static readonly SECONDS_PER_FRAME = 1 / ConstantStepEmitter.FRAMES_PER_SECOND;

  // Accumulated time since stepEmitter fired, to maintain consistent framerate
  private readonly accumulatedTimeProperty: Property<number>;

  public constructor( tandem: Tandem ) {

    super( {
      parameters: [
        { name: 'dt', phetioType: NumberIO }
      ],
      //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/69 Does this need to be instrumented?
      tandem: tandem,
      phetioReadOnly: true, // ... so that PhET-iO clients cannot call emit
      phetioDocumentation: 'Fires when the model is to be stepped.',
      phetioHighFrequency: true
    } );

    this.accumulatedTimeProperty = new NumberProperty( 0, {
      units: 's',
      tandem: tandem.createTandem( 'accumulatedTimeProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Time since stepEmitter last fired. For internal use only.',
      phetioHighFrequency: true
    } );
  }

  public reset(): void {
    this.accumulatedTimeProperty.reset();
  }

  /**
   * Accumulates dt until it reaches the constant dt, then emits.
   * @param dt - time change, in seconds
   */
  public accumulateTime( dt: number ): void {
    this.accumulatedTimeProperty.value += dt;
    if ( this.accumulatedTimeProperty.value > ConstantStepEmitter.SECONDS_PER_FRAME ) {
      this.accumulatedTimeProperty.value -= ConstantStepEmitter.SECONDS_PER_FRAME;
      this.stepOnce();
    }
  }

  /**
   * Advances the model by one constant-dt step. Used by the step button in time controls.
   */
  public stepOnce(): void {
    this.emit( ConstantStepEmitter.CONSTANT_DT );
  }
}

faradaysElectromagneticLab.register( 'ConstantStepEmitter', ConstantStepEmitter );