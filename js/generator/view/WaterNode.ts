// Copyright 2024, University of Colorado Boulder

/**
 * WaterNode is the water that comes out of the faucet in the Generator screen. Its origin is at center top.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle, { RectangleOptions } from '../../../../scenery/js/nodes/Rectangle.js';
import FELColors from '../../common/FELColors.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

const MAX_WIDTH = 60; // width of the water stream when flowRatePercentProperty is at its maximum

type SelfOptions = EmptySelfOptions;

type WaterNodeOptions = SelfOptions & NodeTranslationOptions;

export default class WaterNode extends Rectangle {

  /**
   * @param flowRatePercentProperty
   * @param maxFlowRatePercent
   * @param visibleBoundsProperty - for making the water flow to the bottom of the browser window
   * @param providedOptions
   */
  public constructor( flowRatePercentProperty: TReadOnlyProperty<number>,
                      maxFlowRatePercent: number,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions?: WaterNodeOptions ) {

    const options = optionize<WaterNodeOptions, SelfOptions, RectangleOptions>()( {

      // RectangleOptions
      isDisposable: false,
      fill: FELColors.waterColorProperty
    }, providedOptions );

    super( 0, 0, 1, 1, options );

    Multilink.multilink( [ flowRatePercentProperty, visibleBoundsProperty ],
      ( flowRatePercent, visibleBounds ) => {
        const width = ( flowRatePercent / maxFlowRatePercent ) * MAX_WIDTH;
        this.setRect( -width / 2, 0, width, visibleBounds.height );
      } );
  }
}

faradaysElectromagneticLab.register( 'WaterNode', WaterNode );