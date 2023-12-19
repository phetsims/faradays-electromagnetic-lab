// Copyright 2023, University of Colorado Boulder

//TODO Factor out Indicator base class (with a better name), possibly delete Indicator string union?
/**
 * LightBulb is the model of the light bulb, as an indicator of current in the pickup coil. Intensity of the light
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

  // The intensity of the light. Fully off is 0.0, fully on is 1.0.
  public readonly intensityProperty: TReadOnlyProperty<number>;
  private readonly _intensityProperty: NumberProperty;

  // *** Writeable via developer controls only, when running with &dev query parameter. ***
  // Scales the modulation of alpha that is used to make the light bulb glow.
  public readonly glowScaleProperty: NumberProperty;

  public constructor( pickupCoil: PickupCoil, providedOptions: LightBulbOptions ) {

    const options = optionize<LightBulbOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    //TODO make this [0,1], with default 0.15 ?
    this.glowScaleProperty = new NumberProperty( 15, {
      range: new Range( 1, 100 )
      // Do not instrument. This is a PhET developer Property.
    } );

    // Unfortunately cannot be a DerivedProperty, because the derivation depends on both the new and old value
    // of pickupCoil.currentAmplitudeProperty.
    this._intensityProperty = new NumberProperty( 0, {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'intensityProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );
    this.intensityProperty = this._intensityProperty;

    pickupCoil.currentAmplitudeProperty.link( ( currentAmplitude, previousCurrentAmplitude ) => {
      let intensity = 0;

      if ( !options.lightsWhenCurrentChangesDirection && ( previousCurrentAmplitude !== null ) &&
           ( ( currentAmplitude > 0 && previousCurrentAmplitude <= 0 ) ||
             ( currentAmplitude <= 0 && previousCurrentAmplitude > 0 ) ) ) {
        // Current changed direction, so turn the light off.
        intensity = 0;
      }
      else {
        // Light intensity is proportional to the amplitude of the current in the coil.
        intensity = Math.abs( currentAmplitude );

        // Intensity below the threshold is effectively zero.
        if ( intensity < FELConstants.CURRENT_AMPLITUDE_THRESHOLD ) {
          intensity = 0;
        }
      }

      this._intensityProperty.value = intensity;
    } );
  }

  public reset(): void {
    this._intensityProperty.reset();
    // Do not reset glowScaleProperty, it is a developer control.
  }
}

faradaysElectromagneticLab.register( 'LightBulb', LightBulb );