// Copyright 2023-2024, University of Colorado Boulder

/**
 * LightBulb is the model of the light bulb, as an indicator of current in the pickup coil. Brightness of the light
 * is proportional to the current amplitude in the pickup coil.
 *
 * This is based on LightBulb.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import FELConstants from '../FELConstants.js';
import CurrentIndicator, { CurrentIndicatorOptions } from './CurrentIndicator.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';

const BRIGHTNESS_RANGE = new Range( 0, 1 );

type SelfOptions = {

  // Determines whether the bulb lights when the current in the coil changes direction.
  // In some cases (e.g. flipping the bar magnet) this should be true.
  // In other cases (eg, the Generator or AC Electromagnet) this should be false.

  // REVIEW - Can you explain more about the difference between these two cases?
  // REVIEW - Why is this needed, and why does the designed behavior require this distinction?
  lightsWhenCurrentChangesDirection?: boolean;
};

export type LightBulbOptions = SelfOptions & PickRequired<CurrentIndicatorOptions, 'tandem'>;

export default class LightBulb extends CurrentIndicator {

  // The brightness of the light. Fully off is 0.0, fully on is 1.0.
  public readonly brightnessProperty: TReadOnlyProperty<number>;
  private readonly _brightnessProperty: NumberProperty;

  public constructor( currentAmplitudeProperty: TReadOnlyProperty<number>, currentAmplitudeRange: Range, providedOptions: LightBulbOptions ) {

    const options = optionize<LightBulbOptions, SelfOptions, CurrentIndicatorOptions>()( {

      // SelfOptions
      lightsWhenCurrentChangesDirection: true
    }, providedOptions );

    super( options );

    // Unfortunately cannot be a DerivedProperty, because the derivation depends on both the new and old value
    // of currentAmplitudeProperty.
    this._brightnessProperty = new NumberProperty( 0, {
      range: BRIGHTNESS_RANGE,
      tandem: options.tandem.createTandem( 'brightnessProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );
    this.brightnessProperty = this._brightnessProperty;

    currentAmplitudeProperty.link( ( currentAmplitude, previousCurrentAmplitude ) => {
      let brightness = 0;
      if ( previousCurrentAmplitude !== null &&
           Math.sign( currentAmplitude ) !== Math.sign( previousCurrentAmplitude ) &&
           !options.lightsWhenCurrentChangesDirection ) {

        // Current changed direction and should not light the bulb.
        brightness = 0;
      }
      else if ( Math.abs( currentAmplitude ) < FELConstants.CURRENT_AMPLITUDE_THRESHOLD ) {

        // Current below the threshold does not light the bulb.
        brightness = 0;
      }
      else {

        // Map current amplitude to brightness.
        brightness = Utils.linear( 0, currentAmplitudeRange.max, BRIGHTNESS_RANGE.min, BRIGHTNESS_RANGE.max, Math.abs( currentAmplitude ) );
      }

      this._brightnessProperty.value = brightness;
    } );
  }

  public reset(): void {
    this._brightnessProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'LightBulb', LightBulb );