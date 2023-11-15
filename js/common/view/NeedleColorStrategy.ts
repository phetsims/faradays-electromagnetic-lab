// Copyright 2023, University of Colorado Boulder

/**
 * NeedleColorStrategy is the base class for strategies that converts B-field strength to Color.
 * B-field strength is a scale value between 0 and 1 inclusive.
 *
 * Two concrete strategies are provided.
 *
 * AlphaColorStrategy modulates the alpha channel, with stronger B-field being more opaque. This strategy works on
 * any background color, but may have a performance cost associated with using the alpha channel.
 *
 * Saturation modulates the RGB channels, with stronger B-fields being more saturated. This strategy works only on
 * black backgrounds, but performance is better than AlphaColorStrategy.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Color } from '../../../../scenery/js/imports.js';

export default abstract class NeedleColorStrategy {

  protected constructor() {
    // Use createStrategy to create instances.
  }

  /**
   * Gets a color for the north pole.
   * @param strength - 0 to 1
   * @param fullStrengthColor - the Color for strength === 1
   */
  public abstract strengthToColor( strength: number, fullStrengthColor: Color ): Color;

  /**
   * Creates the appropriate strategy for a specified background color.
   */
  public static createStrategy( backgroundColor: Color ): NeedleColorStrategy {
    return ( backgroundColor.equals( Color.BLACK ) ) ? new SaturationColorStrategy() : new AlphaColorStrategy();
  }
}

class AlphaColorStrategy extends NeedleColorStrategy {

  public strengthToColor( strength: number, baseColor: Color ): Color {
    assert && assert( strength >= 0 && strength <= 1, `invalid strength: ${strength}` );
    return baseColor.withAlpha( strength );
  }
}

class SaturationColorStrategy extends NeedleColorStrategy {

  public strengthToColor( strength: number, baseColor: Color ): Color {
    assert && assert( strength >= 0 && strength <= 1, `invalid strength: ${strength}` );
    const r = strength * baseColor.red;
    const g = strength * baseColor.green;
    const b = strength * baseColor.blue;
    return new Color( r, g, b );
  }
}

faradaysElectromagneticLab.register( 'NeedleColorStrategy', NeedleColorStrategy );