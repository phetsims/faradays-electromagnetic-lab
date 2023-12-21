// Copyright 2023, University of Colorado Boulder

/**
 * ACPowerSupply is the model for an AC power supply, used to power the electromagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import CurrentSource from './CurrentSource.js';

export default class ACPowerSupply extends CurrentSource {

  public constructor( tandem: Tandem ) {

    super( {
      maxVoltage: 110, // volts
      tandem: tandem
    } );

    //TODO
  }

  public override reset(): void {
    super.reset();
    //TODO
  }

  public step( dt: number ): void {
    //TODO
  }
}

faradaysElectromagneticLab.register( 'ACPowerSupply', ACPowerSupply );