// Copyright 2023-2024, University of Colorado Boulder

/**
 * ImmediateCompass immediately sets the compass direction to match the direction of the B-field.
 * This compass is used with the Generator.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Compass, { CompassOptions } from './Compass.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Magnet from './Magnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;

type ImmediateCompassOptions = SelfOptions & CompassOptions;

export default class ImmediateCompass extends Compass {

  public constructor( magnet: Magnet, isPlayingProperty: TReadOnlyProperty<boolean>, providedOptions: ImmediateCompassOptions ) {
    super( magnet, isPlayingProperty, providedOptions );
  }

  /**
   * Updates the compass needle's angle.
   * @param fieldVector - the magnet's B-field vector at the compass position
   * @param dt - time step, in seconds
   */
  protected override updateAngle( fieldVector: Vector2, dt: number ): void {
    this._angleProperty.value = fieldVector.angle;
  }
}

faradaysElectromagneticLab.register( 'ImmediateCompass', ImmediateCompass );