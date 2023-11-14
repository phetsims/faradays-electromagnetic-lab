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
import { Node, VBox } from '../../../../scenery/js/imports.js';
import BarMagnetViewProperties from './BarMagnetViewProperties.js';
import Multilink from '../../../../axon/js/Multilink.js';
import BarMagnetNode from '../../common/view/BarMagnetNode.js';
import BarMagnetVisibilityPanel from './BarMagnetVisibilityPanel.js';
import EarthNode from '../../common/view/EarthNode.js';

export default class BarMagnetScreenView extends ScreenView {

  private readonly viewProperties: BarMagnetViewProperties;

  public constructor( model: BarMagnetModel, tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    this.viewProperties = new BarMagnetViewProperties( tandem.createTandem( 'viewProperties' ) );

    const barMagnetNode = new BarMagnetNode( model.barMagnet, tandem.createTandem( 'barMagnetNode' ) );

    const earthNode = new EarthNode( model.barMagnet, this.viewProperties.earthVisibleProperty,
      tandem.createTandem( 'earthNode' ) );

    const barMagnetPanel = new BarMagnetPanel( model.barMagnet, this.viewProperties.seeInsideBarMagnetProperty,
      tandem.createTandem( 'barMagnetPanel' ) );

    const visibilityPanel = new BarMagnetVisibilityPanel(
      this.viewProperties.fieldVisibleProperty,
      this.viewProperties.compassVisibleProperty,
      this.viewProperties.fieldMeterVisibleProperty,
      this.viewProperties.earthVisibleProperty,
      tandem.createTandem( 'visibilityPanel' )
    );

    const controlPanels = new VBox( {
      stretch: true,
      spacing: 10,
      children: [
        barMagnetPanel,
        visibilityPanel
      ]
    } );

    // Adjust position of the control panels
    Multilink.multilink( [ controlPanels.boundsProperty, this.visibleBoundsProperty ],
      ( controlPanelsBounds, visibleBounds ) => {
        controlPanels.right = visibleBounds.right - FELConstants.SCREEN_VIEW_X_MARGIN;
        controlPanels.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
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
        earthNode,
        barMagnetNode,
        controlPanels,
        resetAllButton
      ]
    } );
    this.addChild( rootNode );

    rootNode.pdomOrder = [
      barMagnetNode,
      controlPanels,
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