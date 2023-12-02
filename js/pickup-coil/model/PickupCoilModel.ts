// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoilModel is the top-level model for the 'Pickup Coil' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnetModel from '../../bar-magnet/model/BarMagnetModel.js';
import PickupCoil from '../../common/model/PickupCoil.js';

export default class PickupCoilModel extends BarMagnetModel {

  public readonly pickupCoil: PickupCoil;

  public constructor( tandem: Tandem ) {

    super( tandem );

    this.pickupCoil = new PickupCoil( {
      //TODO position
      tandem: tandem.createTandem( 'pickupCoil' )
    } );
  }

  /**
   * Resets the model.
   */
  public override reset(): void {
    super.reset();
    this.pickupCoil.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    super.step( dt );
    this.pickupCoil.step( dt );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilModel', PickupCoilModel );