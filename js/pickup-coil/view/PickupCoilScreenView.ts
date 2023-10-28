// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickupCoilModel from '../model/PickupCoilModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class PickupCoilScreenView extends ScreenView {

  public constructor( model: PickupCoilModel, tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - FELConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - FELConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  public reset(): void {
    this.interruptSubtreeInput(); // cancel interactions that may be in progress
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    //TODO
  }
}

faradaysElectromagneticLab.register( 'PickupCoilScreenView', PickupCoilScreenView );