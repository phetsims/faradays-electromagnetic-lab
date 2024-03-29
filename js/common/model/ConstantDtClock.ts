// Copyright 2024, University of Colorado Boulder

/**
 * ConstantDtClock implements a clock that 'ticks' at a constant rate, with a constant dt.
 * In the Java version of this sim, we used a clock that fires 25 times per second, with constant dt = 1.
 * In FaradayModule.java, see new SwingClock( 1000 / 25, 1 ).
 * Because so much of the code ported from Java relies on this, we implement something similar here.
 *
 * Note that this is an extension of EventTimer, with the ability to add listeners that are notified when
 * the event occurs. In EventTimer terminology, the event is a 'clock tick'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import EventTimer from '../../../../phet-core/js/EventTimer.js';

export default class ConstantDtClock extends EventTimer {

  // Constant framerate, inherited from the Java implementation. Increasing this value makes the sim run faster,
  // reducing it makes the sim run slower. Changing this value may have unintended/unknown consequences, so proceed
  // with caution.
  public static readonly FRAMES_PER_SECOND = 25;

  // Constant dt, inherited from the Java implementation. Each time the clock ticks (about every 40 ms at 25 fps),
  // we'll step with this dt value. So while step is usually called with a value in seconds, this value is not in
  // seconds. Changing this value may have unintended/unknown consequences, so proceed with caution.
  public static readonly DT = 1;

  // For notifying listeners when the clock ticks. The single parameter to emit is dt.
  private readonly emitter: Emitter<[ number ]>;

  public constructor() {

    // Notify listeners that the clock has ticked, with a constant dt.
    // Calling ConstantDtClock step with a large dt will result in multiple clock ticks.
    const eventCallback = ( timeElapsed: number ) => this.emitter.emit( ConstantDtClock.DT );

    // eventCallback will be called every 1 / FRAMES_PER_SECOND seconds.
    const eventModel = new EventTimer.ConstantEventModel( ConstantDtClock.FRAMES_PER_SECOND );

    super( eventModel, eventCallback );

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
   * Advances the model by one constant-dt step. Used by the step button in time controls.
   */
  public stepOnce(): void {
    this.emitter.emit( ConstantDtClock.DT );
  }
}

faradaysElectromagneticLab.register( 'ConstantDtClock', ConstantDtClock );