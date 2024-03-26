// Copyright 2024, University of Colorado Boulder

/**
 * Water faucet is the model of the water faucet in the Generator screen. It dispenses water at a variable rate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';

export default class WaterFaucet extends PhetioObject {

  // Flow rate of water coming out of the faucet
  public readonly flowRateProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem,
      phetioState: false
    } );

    // REVIEW - Should this be called flowRatePercentProperty?
    this.flowRateProperty = new NumberProperty( 0, {
      units: '%',
      range: new Range( 0, 100 ),
      tandem: tandem.createTandem( 'flowRateProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.flowRateProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'WaterFaucet', WaterFaucet );