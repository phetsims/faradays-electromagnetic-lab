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
import ElectromagnetModel from '../model/ElectromagnetModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class ElectromagnetScreenView extends ScreenView {

  public constructor( model: ElectromagnetModel, tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    this.visibleBoundsProperty.link( visibleBounds => {
      resetAllButton.right = visibleBounds.maxX - FELConstants.SCREEN_VIEW_X_MARGIN;
      resetAllButton.bottom = visibleBounds.maxY - FELConstants.SCREEN_VIEW_Y_MARGIN;
    } );
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

faradaysElectromagneticLab.register( 'ElectromagnetScreenView', ElectromagnetScreenView );