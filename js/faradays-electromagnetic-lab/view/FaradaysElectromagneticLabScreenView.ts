// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import FaradaysElectromagneticLabConstants from '../../common/FaradaysElectromagneticLabConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabModel from '../model/FaradaysElectromagneticLabModel.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
 //TODO add options that are specific to FaradaysElectromagneticLabScreenView here
};

type FaradaysElectromagneticLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class FaradaysElectromagneticLabScreenView extends ScreenView {

  public constructor( model: FaradaysElectromagneticLabModel, providedOptions: FaradaysElectromagneticLabScreenViewOptions ) {

    const options = optionize<FaradaysElectromagneticLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( options );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - FaradaysElectromagneticLabConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - FaradaysElectromagneticLabConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    //TODO
  }
}

faradaysElectromagneticLab.register( 'FaradaysElectromagneticLabScreenView', FaradaysElectromagneticLabScreenView );