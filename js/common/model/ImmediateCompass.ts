// Copyright 2023-2024, University of Colorado Boulder

/**
 * ImmediateCompass immediately sets the compass direction to match the direction of the B-field.
 * This compass is used in the Generator screen.
 *
 * This is based on inner class ImmediateBehavior of Compass.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Compass, { CompassOptions } from './Compass.js';
import Magnet from './Magnet.js';

type SelfOptions = EmptySelfOptions;

type ImmediateCompassOptions = SelfOptions & CompassOptions;

export default class ImmediateCompass extends Compass {

  public constructor( magnet: Magnet, isPlayingProperty: TReadOnlyProperty<boolean>, providedOptions: ImmediateCompassOptions ) {

    const options = optionize<ImmediateCompassOptions, SelfOptions, CompassOptions>()( {

      // CompassOptions
      phetioDocumentation: 'A compass that moves immediately to match the direction of the magnetic field.'
    }, providedOptions );

    super( magnet, isPlayingProperty, options );
  }

  /**
   * Updates the compass needle's angle. This is a no-op if the field magnitude is zero.
   *
   * @param fieldVector - the magnet's B-field vector at the compass position
   * @param dt - time step, in seconds
   */
  protected override updateNeedleAngle( fieldVector: Vector2, dt: number ): void {
    if ( fieldVector.magnitude !== 0 ) {
      this.updateNeedleAngleImmediately( fieldVector.angle );
    }
  }
}

faradaysElectromagneticLab.register( 'ImmediateCompass', ImmediateCompass );