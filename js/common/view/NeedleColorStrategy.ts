// Copyright 2023, University of Colorado Boulder

/**
 * NeedleColorStrategy is the base class for strategies that convert B-field strength to Colors.
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
import { Color, ProfileColorProperty } from '../../../../scenery/js/imports.js';

export default abstract class NeedleColorStrategy {

  protected northColorProperty: ProfileColorProperty;
  protected southColorProperty: ProfileColorProperty;

  protected constructor( northColorProperty: ProfileColorProperty, southColorProperty: ProfileColorProperty ) {
    this.northColorProperty = northColorProperty;
    this.southColorProperty = southColorProperty;
  }

  /**
   * Gets a color for the north pole.
   * @param scale - 0 to 1
   */
  public abstract getNorthColor( scale: number ): Color;

  /**
   * Gets a color for the south pole.
   * @param scale - 0 to 1
   */
  public abstract getSouthColor( scale: number ): Color;

  /**
   * Creates the appropriate strategy for a specified background color.
   */
  public static createStrategy( backgroundColor: Color, northColorProperty: ProfileColorProperty, southColorProperty: ProfileColorProperty ): NeedleColorStrategy {
    return ( backgroundColor.equals( Color.BLACK ) ) ?
           new SaturationColorStrategy( northColorProperty, southColorProperty ) :
           new AlphaColorStrategy( northColorProperty, southColorProperty );
  }
}

class AlphaColorStrategy extends NeedleColorStrategy {

  public getNorthColor( scale: number ): Color {
    assert && assert( scale >= 0 && scale <= 1, `invalid scale: ${scale}` );
    return this.northColorProperty.value.withAlpha( scale );
  }

  public getSouthColor( scale: number ): Color {
    assert && assert( scale >= 0 && scale <= 1, `invalid alpha: ${scale}` );
    return this.southColorProperty.value.withAlpha( scale );
  }
}

class SaturationColorStrategy extends NeedleColorStrategy {

  public getNorthColor( scale: number ): Color {
    return SaturationColorStrategy.scaleRGB( scale, this.northColorProperty.value );
  }

  public getSouthColor( scale: number ): Color {
    return SaturationColorStrategy.scaleRGB( scale, this.southColorProperty.value );
  }

  private static scaleRGB( scale: number, color: Color ): Color {
    assert && assert( scale >= 0 && scale <= 1, `invalid scale: ${scale}` );
    const r = scale * color.red;
    const g = scale * color.green;
    const b = scale * color.blue;
    return new Color( r, g, b );
  }
}

faradaysElectromagneticLab.register( 'NeedleColorStrategy', NeedleColorStrategy );