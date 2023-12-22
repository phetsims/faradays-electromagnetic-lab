// Copyright 2023, University of Colorado Boulder

/**
 * FluidNode is the fluid that comes out of the faucet in the Generator screen. Its origin is a center top.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

const MAX_WIDTH = 60;
const HEIGHT = 2000; //TODO

export default class FluidNode extends Rectangle {

  public constructor( flowRateProperty: TReadOnlyProperty<number>, maxFlowRate: number ) {

    super( 0, 0, 1, 1, {
      isDisposable: false,
      fill: 'rgba( 194, 234, 255, 0.7 )', //TODO color profile
      stroke: null //TODO color profile
    } );

    flowRateProperty.link( flowRate => {
      if ( flowRate === 0 ) {
        this.setRect( 0, 0, 0, 0 );
      }
      else {
        const width = ( flowRate / maxFlowRate ) * MAX_WIDTH;
        this.setRect( -width / 2, 0, width, HEIGHT );
      }
    } );
  }
}

faradaysElectromagneticLab.register( 'FluidNode', FluidNode );