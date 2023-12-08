// Copyright 2023, University of Colorado Boulder

//TODO Factor out Indicator base class (with a better name), possibly delete Indicator string union?
/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickupCoil from './PickupCoil.js';

export default class Voltmeter {

  private readonly pickupCoil: PickupCoil;

  public constructor( pickupCoil: PickupCoil, tandem: Tandem ) {

    this.pickupCoil = pickupCoil;
  }

  public reset(): void {
    //TODO
  }

  public step( dt: number ): void {
    //TODO
  }
}

faradaysElectromagneticLab.register( 'Voltmeter', Voltmeter );