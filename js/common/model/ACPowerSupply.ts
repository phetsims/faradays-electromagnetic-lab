// Copyright 2023, University of Colorado Boulder

//TODO Factor out CurrentSource base class, possibly delete CurrentSource string union?
/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';

export default class ACPowerSupply extends PhetioObject {

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioState: false
    } );

    //TODO
  }

  public reset(): void {
    //TODO
  }

  public step( dt: number ): void {
    //TODO
  }
}

faradaysElectromagneticLab.register( 'ACPowerSupply', ACPowerSupply );