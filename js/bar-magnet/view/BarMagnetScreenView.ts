// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetScreenView is the top-level view for the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnetModel from '../model/BarMagnetModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnetPanel from '../../common/view/BarMagnetPanel.js';
import { Node } from '../../../../scenery/js/imports.js';
import BarMagnetViewProperties from './BarMagnetViewProperties.js';
import Multilink from '../../../../axon/js/Multilink.js';

export default class BarMagnetScreenView extends ScreenView {

  private readonly viewProperties: BarMagnetViewProperties;

  public constructor( model: BarMagnetModel, tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    this.viewProperties = new BarMagnetViewProperties( tandem.createTandem( 'viewProperties' ) );

    const barMagnetPanel = new BarMagnetPanel( model.barMagnet, this.viewProperties.seeInsideBarMagnetProperty,
      tandem.createTandem( 'barMagnetPanel' ) );
    Multilink.multilink( [ barMagnetPanel.boundsProperty, this.visibleBoundsProperty ],
      ( barMagnetPanelBounds, visibleBounds ) => {
        barMagnetPanel.right = visibleBounds.right - FELConstants.SCREEN_VIEW_X_MARGIN;
        barMagnetPanel.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
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

    const rootNode = new Node( {
      children: [
        barMagnetPanel,
        resetAllButton
      ]
    } );
    this.addChild( rootNode );

    rootNode.pdomOrder = [
      barMagnetPanel,
      resetAllButton
    ];
  }

  public reset(): void {
    this.interruptSubtreeInput(); // cancel interactions that may be in progress
    this.viewProperties.reset();
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    //TODO
  }
}

faradaysElectromagneticLab.register( 'BarMagnetScreenView', BarMagnetScreenView );