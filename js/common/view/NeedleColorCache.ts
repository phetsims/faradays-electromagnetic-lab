// Copyright 2023, University of Colorado Boulder

/**
 * NeedleColorCache is a cache of the colors used to draw B-field needles. The cache contains a maximum number
 * of colors, and B-field strength is mapped to the closest color. The cache can be populated lazily or eagerly.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NeedleColorStrategy from './NeedleColorStrategy.js';
import { Color, ProfileColorProperty } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  cacheSize?: number; // the maximum number of colors in the cache
  populateEagerly?: boolean; // whether to populate the cache eagerly or lazily
};

type NeedleColorCacheOptions = SelfOptions;

export default class NeedleColorCache {

  private readonly needleColorStrategyProperty: TReadOnlyProperty<NeedleColorStrategy>;
  private readonly needleColorProperty: ProfileColorProperty;
  private readonly colors: Color[];
  private readonly cacheSize: number;

  public constructor( needleColorStrategyProperty: TReadOnlyProperty<NeedleColorStrategy>,
                      needleColorProperty: ProfileColorProperty,
                      providedOptions?: NeedleColorCacheOptions ) {

    const options = optionize<NeedleColorCacheOptions, SelfOptions>()( {

      // SelfOptions
      cacheSize: 256,
      populateEagerly: true
    }, providedOptions );

    this.needleColorStrategyProperty = needleColorStrategyProperty;
    this.needleColorProperty = needleColorProperty;
    this.colors = [];
    this.cacheSize = options.cacheSize;

    options.populateEagerly && this.populate();

    // If the color strategy changes, clear the cache and (optionally) populate eagerly.
    this.needleColorStrategyProperty.lazyLink( () => {
      this.clear();
      options.populateEagerly && this.populate();
    } );
  }

  /**
   * Gets the color for a specified strength.
   * The strength [0,1] is converted to an integer, which is used as an index into the cache.
   * If the color is in the cache, it is returned. Otherwise, the color is created and added to the cache.
   */
  public getColor( strength: number ): Color {
    assert && assert( strength >= 0 && strength <= 1, `invalid strength: ${strength}` );
    const index = Utils.roundSymmetric( ( this.cacheSize - 1 ) * strength );
    let color = this.colors[ index ];
    if ( !color ) {
      color = this.needleColorStrategyProperty.value.strengthToColor( strength, this.needleColorProperty.value );
      this.colors[ index ] = color;
      assert && assert( this.colors.length <= this.cacheSize );
    }
    assert && assert( color );
    return color;
  }


  /**
   * Fully populates the cache. If this is not called, then the cache is populated as colors are needed.
   */
  private populate(): void {
    const deltaStrength = 1 / ( this.cacheSize - 1 );
    for ( let i = 0; i < this.cacheSize; i++ ) {
      this.getColor( i * deltaStrength );
    }
    assert && assert( this.colors.length === this.cacheSize );
  }

  /**
   * Clears the cache.
   */
  private clear(): void {
    this.colors.length = 0;
  }
}

faradaysElectromagneticLab.register( 'NeedleColorStrategy', NeedleColorStrategy );