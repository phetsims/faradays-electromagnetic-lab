// Copyright 2023, University of Colorado Boulder

/**
 * LightBulb is the model of the light bulb, as an indicator of current in the pickup coil. Brightness of the light
 * is proportional to the current amplitude in the pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickupCoil from './PickupCoil.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Range from '../../../../dot/js/Range.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import FELConstants from '../FELConstants.js';

type SelfOptions = {

  // Determines whether the bulb lights when the current in the coil changes direction.
  // In some cases (e.g. flipping the bar magnet) this should be true.
  // In other cases (eg, the Generator or AC Electromagnet) this should be false.
  lightsWhenCurrentChangesDirection: boolean;
};

type LightBulbOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class LightBulb extends PhetioObject {

  // The brightness of the light. Fully off is 0.0, fully on is 1.0.
  public readonly brightnessProperty: TReadOnlyProperty<number>;
  private readonly _brightnessProperty: NumberProperty;

  public constructor( pickupCoil: PickupCoil, providedOptions: LightBulbOptions ) {

    const options = optionize<LightBulbOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    // Unfortunately cannot be a DerivedProperty, because the derivation depends on both the new and old value
    // of pickupCoil.currentAmplitudeProperty.
    this._brightnessProperty = new NumberProperty( 0, {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'brightnessProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );
    this.brightnessProperty = this._brightnessProperty;

    pickupCoil.currentAmplitudeProperty.link( ( currentAmplitude, previousCurrentAmplitude ) => {
      let brightness = 0;

      if ( !options.lightsWhenCurrentChangesDirection && ( previousCurrentAmplitude !== null ) &&
           ( ( currentAmplitude > 0 && previousCurrentAmplitude <= 0 ) ||
             ( currentAmplitude <= 0 && previousCurrentAmplitude > 0 ) ) ) {
        // Current changed direction, so turn the light off.
        brightness = 0;
      }
      else {
        // Brightness is proportional to the amplitude of the current in the coil.
        brightness = Math.abs( currentAmplitude );

        // Brightness below the threshold is effectively zero.
        if ( brightness < FELConstants.CURRENT_AMPLITUDE_THRESHOLD ) {
          brightness = 0;
        }
      }

      this._brightnessProperty.value = brightness;
    } );
  }

  public reset(): void {
    this._brightnessProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'LightBulb', LightBulb );