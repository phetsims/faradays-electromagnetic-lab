// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BarMagnet, { BarMagnetOptions } from '../../common/model/BarMagnet.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

export type TurbineOptions = SelfOptions & BarMagnetOptions;

export default class Turbine extends BarMagnet {

  public constructor( providedOptions: TurbineOptions ) {

    super( providedOptions );

    //TODO
  }

  public override reset(): void {
    super.reset();
    //TODO
  }

  public step( dt: number ): void {
    //TODO beware of dependencies on SwingClock.java !!
  }
}

faradaysElectromagneticLab.register( 'Turbine', Turbine );