// Copyright 2023, University of Colorado Boulder

/**
 * NeedleColorCache is a cache of the colors used to draw B-field needles. The cache contains a maximum number
 * of colors, and B-field strength is mapped to the closest color. The cache can be populated lazily or eagerly,
 * via the populateEagerly constructor parameter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NeedleColorStrategy from './NeedleColorStrategy.js';
import { Color, ProfileColorProperty } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';

const NUMBER_OF_COLORS = 256; // the maximum number of colors in the cache

export default class NeedleColorCache {

  private readonly needleColorStrategyProperty: TReadOnlyProperty<NeedleColorStrategy>;
  private readonly needleColorProperty: ProfileColorProperty;
  private readonly colors: Color[];

  public constructor( needleColorStrategyProperty: TReadOnlyProperty<NeedleColorStrategy>, needleColorProperty: ProfileColorProperty, populateEagerly = true ) {

    this.needleColorStrategyProperty = needleColorStrategyProperty;
    this.needleColorProperty = needleColorProperty;
    this.colors = [];

    populateEagerly && this.populate();

    // If the color strategy changes, clear the cache and (optionally) populate eagerly.
    this.needleColorStrategyProperty.lazyLink( () => {
      this.clear();
      populateEagerly && this.populate();
    } );
  }

  /**
   * Gets the color for a specified strength.
   * The strength [0,1] is converted to an integer, which is used as an index into the cache.
   * If the color is in the cache, it is returned. Otherwise, the color is created and added to the cache.
   */
  public getColor( strength: number ): Color {
    assert && assert( strength >= 0 && strength <= 1, `invalid strength: ${strength}` );
    const index = Utils.roundSymmetric( ( NUMBER_OF_COLORS - 1 ) * strength );
    let color = this.colors[ index ];
    if ( !color ) {
      color = this.needleColorStrategyProperty.value.strengthToColor( strength, this.needleColorProperty.value );
      this.colors[ index ] = color;
      assert && assert( this.colors.length <= NUMBER_OF_COLORS );
    }
    assert && assert( color );
    return color;
  }


  /**
   * Fully populates the cache. If this is not called, then the cache is populated as colors are needed.
   */
  private populate(): void {
    const deltaStrength = 1.0 / ( NUMBER_OF_COLORS - 1 );
    for ( let i = 0; i < NUMBER_OF_COLORS; i++ ) {
      this.getColor( i * deltaStrength );
    }
    assert && assert( this.colors.length === NUMBER_OF_COLORS );
  }

  /**
   * Clears the cache.
   */
  private clear(): void {
    this.colors.length = 0;
  }
}

faradaysElectromagneticLab.register( 'NeedleColorStrategy', NeedleColorStrategy );