// Copyright 2023, University of Colorado Boulder

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

type SelfOptions = EmptySelfOptions;

type ImmediateCompassOptions = SelfOptions & CompassOptions;

export default class ImmediateCompass extends Compass {

  public constructor( magnet: Magnet, providedOptions: ImmediateCompassOptions ) {
    super( magnet, providedOptions );
  }

  protected override updateRotation( fieldVector: Vector2, dt: number ): void {
    this._rotationProperty.value = fieldVector.angle;
  }

  public override startMovingNow(): void {
    // Do nothing
  }
}

faradaysElectromagneticLab.register( 'ImmediateCompass', ImmediateCompass );