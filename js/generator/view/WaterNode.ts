// Copyright 2024, University of Colorado Boulder

/**
 * WaterNode is the water that comes out of the faucet in the Generator screen. Its origin is a center top.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { NodeTranslationOptions, Rectangle, RectangleOptions } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import FELColors from '../../common/FELColors.js';

const MAX_WIDTH = 60; // width of the fluid stream when flowRateProperty is at its maximum

type SelfOptions = EmptySelfOptions;

type WaterNodeOptions = SelfOptions & NodeTranslationOptions;

export default class WaterNode extends Rectangle {

  public constructor( flowRateProperty: TReadOnlyProperty<number>,
                      maxFlowRate: number,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions?: WaterNodeOptions ) {
    
    const options = optionize<WaterNodeOptions, SelfOptions, RectangleOptions>()( {
      
      // RectangleOptions
      isDisposable: false,
      fill: FELColors.waterColorProperty
    }, providedOptions );

    super( 0, 0, 1, 1, options );

    Multilink.multilink( [ flowRateProperty, visibleBoundsProperty ],
      ( flowRate, visibleBounds ) => {
        if ( flowRate === 0 ) {
          this.setRect( 0, 0, 0, 0 );
        }
        else {
          const width = ( flowRate / maxFlowRate ) * MAX_WIDTH;
          this.setRect( -width / 2, 0, width, visibleBounds.height );
        }
      } );
  }
}

faradaysElectromagneticLab.register( 'WaterNode', WaterNode );