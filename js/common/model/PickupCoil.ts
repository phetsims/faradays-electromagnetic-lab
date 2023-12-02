// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoil is the model of a pickup coil.
 * TODO etc. etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import FELMovable, { FELMovableOptions } from './FELMovable.js';

type SelfOptions = EmptySelfOptions;

export type PickupCoilOptions = SelfOptions & FELMovableOptions;


export default class PickupCoil extends FELMovable {

  public constructor( providedOptions: PickupCoilOptions ) {

    const options = providedOptions;

    //TODO

    super( options );
  }

  public step( dt: number ): void {
    //TODO step the coil, light, voltmeter - beware of dependencies on SwingTimer.java !!
  }
}

faradaysElectromagneticLab.register( 'PickupCoil', PickupCoil );