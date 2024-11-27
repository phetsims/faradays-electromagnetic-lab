// Copyright 2024, University of Colorado Boulder

/**
 * ConstantDtClock implements a clock that steps at a constant rate, with a constant dt.
 *
 * In the Java version of this sim, we used a clock that steps 25 times per second, with constant dt = 1.
 * See FaradayModule.java: new SwingClock( 1000 / 25, 1 )
 * Because so much of the code ported from Java relies on this, we have implemented something similar here.
 *
 * Note that we are not using EventTimer here, because EventTimer will result in multiple 'events' if dt is large.
 * That is undesirable for this sim, because it will cause single-step events (such as lighting the light bulb when
 * magnet polarity is flipped) to go unseen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

export default class ConstantDtClock {

  // Constant framerate, inherited from the Java implementation. Increasing this value makes the sim run faster,
  // reducing it makes the sim run slower. Changing this value may have unintended/unknown consequences, so proceed
  // with caution.
  public static readonly FRAMES_PER_SECOND = 25;
  private static readonly SECONDS_PER_FRAME = 1 / ConstantDtClock.FRAMES_PER_SECOND;

  // Constant dt, inherited from the Java implementation. Each time the clock steps (about every 40 ms at 25 fps),
  // we'll notify listeners with this dt value. So while step is usually called with a value in seconds, this value
  // is not in seconds. Changing this value may have unintended/unknown consequences, so proceed with caution.
  public static readonly DT = 1;

  // Time since the clock last notified listeners.
  private elapsedTime: number;

  // For notifying listeners when the clock steps. The single parameter to emit is the constant dt value.
  private readonly emitter: Emitter<[ number ]>;

  public constructor() {

    this.elapsedTime = 0;

    this.emitter = new Emitter( {
      parameters: [ { name: 'dt', phetioType: NumberIO } ]
    } );
  }

  /**
   * Adds a listener that will be notified when the clock ticks.
   * @param listener
   */
  public addListener( listener: ( dt: number ) => void ): void {
    this.emitter.addListener( listener );
  }

  /**
   * Accumulates dt until it reaches the constant dt, then emits once.
   * Unlike EventTimer, this will not result in more than 1 step if dt is large.
   *
   * @param dt - time change, in seconds
   */
  public step( dt: number ): void {
    this.elapsedTime += dt;

    // When we've accumulated enough time to step ...
    if ( this.elapsedTime >= ConstantDtClock.SECONDS_PER_FRAME ) {

      // Advance one step.
      this.stepOnce();

      // Apply the remainder to the next step.
      this.elapsedTime %= ConstantDtClock.SECONDS_PER_FRAME;
    }
  }

  /**
   * Advances the model by one step, with constant dt. In addition to being called by the step method, this is called
   * explicitly by the step button in time controls.
   */
  public stepOnce(): void {
    this.emitter.emit( ConstantDtClock.DT );
  }
}

faradaysElectromagneticLab.register( 'ConstantDtClock', ConstantDtClock );