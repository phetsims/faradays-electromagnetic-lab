// Copyright 2023-2024, University of Colorado Boulder

/**
 * LightBulb is the model of the light bulb, as an indicator of current in the pickup coil. Brightness of the light
 * is proportional to the current in the pickup coil.
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
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

const BRIGHTNESS_RANGE = new Range( 0, 1 );

type SelfOptions = {

  // For current that is cyclic and changes direction (AC Electromagnet, Generator) the model may step over the
  // zero points, which is where the current changes dirction. This Property should be set to false for those cases,
  // so that the light bulb is guaranteed to go through an 'off' state. This is most noticeable when stepping the sim
  // manually using the time controls. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/152.
  lightsWhenCurrentChangesDirectionProperty?: TReadOnlyProperty<boolean>;
};

export type LightBulbOptions = SelfOptions & PickRequired<CurrentIndicatorOptions, 'tandem'>;

export default class LightBulb extends CurrentIndicator {

  // The brightness of the light. Fully off is 0.0, fully on is 1.0.
  public readonly brightnessProperty: TReadOnlyProperty<number>;
  private readonly _brightnessProperty: NumberProperty;

  public constructor( normalizedCurrentProperty: TReadOnlyProperty<number>, normalizedCurrentRange: Range, providedOptions: LightBulbOptions ) {

    const options = optionize<LightBulbOptions, SelfOptions, CurrentIndicatorOptions>()( {

      // SelfOptions
      lightsWhenCurrentChangesDirectionProperty: providedOptions.lightsWhenCurrentChangesDirectionProperty || new BooleanProperty( true )
    }, providedOptions );

    super( options );

    // Unfortunately cannot be a DerivedProperty, because the derivation depends on both the new and old value
    // of normalizedCurrentProperty.
    this._brightnessProperty = new NumberProperty( 0, {
      range: BRIGHTNESS_RANGE,
      tandem: options.tandem.createTandem( 'brightnessProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );
    this.brightnessProperty = this._brightnessProperty;

    normalizedCurrentProperty.link( ( normalizedCurrent, previousNormalizedCurrent ) => {
      let brightness = 0;
      if ( previousNormalizedCurrent !== null &&
           Math.sign( normalizedCurrent ) !== Math.sign( previousNormalizedCurrent ) &&
           !options.lightsWhenCurrentChangesDirectionProperty.value ) {

        // Current changed direction and should not light the bulb.
        brightness = 0;
      }
      else if ( Math.abs( normalizedCurrent ) < FELConstants.NORMALIZED_CURRENT_THRESHOLD ) {

        // Current below the threshold does not light the bulb.
        brightness = 0;
      }
      else {

        // Map current to brightness.
        brightness = Utils.linear( 0, normalizedCurrentRange.max, BRIGHTNESS_RANGE.min, BRIGHTNESS_RANGE.max, Math.abs( normalizedCurrent ) );
      }

      this._brightnessProperty.value = brightness;
    } );
  }

  public reset(): void {
    this._brightnessProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'LightBulb', LightBulb );