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
import FieldNode from '../../common/view/FieldNode.js';
import FieldMeterNode from '../../common/view/FieldMeterNode.js';
import CompassNode from '../../common/view/CompassNode.js';

export default class BarMagnetScreenView extends ScreenView {

  public constructor( model: BarMagnetModel, tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    const viewProperties = new BarMagnetViewProperties( tandem.createTandem( 'viewProperties' ) );

    viewProperties.earthVisibleProperty.link( earthVisible => {
      if ( earthVisible ) {
        model.barMagnet.rotationProperty.value = -Math.PI / 2; // north is up
      }
      else {
        model.barMagnet.rotationProperty.value = 0; // north is to the right
      }
    } );

    const fieldNode = new FieldNode( model.barMagnet, {
      visibleBoundsProperty: this.visibleBoundsProperty,
      visibleProperty: viewProperties.fieldVisibleProperty,
      tandem: tandem.createTandem( 'fieldNode' )
    } );

    const barMagnetNode = new BarMagnetNode( model.barMagnet, {
      seeInsideProperty: viewProperties.seeInsideBarMagnetProperty,
      tandem: tandem.createTandem( 'barMagnetNode' )
    } );

    const fieldMeterNode = new FieldMeterNode( model.fieldMeter, {
      visibleProperty: viewProperties.fieldMeterVisibleProperty,
      tandem: tandem.createTandem( 'fieldMeterNode' )
    } );

    const compassNode = new CompassNode( model.compass, {
      visibleProperty: viewProperties.compassVisibleProperty,
      tandem: tandem.createTandem( 'compassNode' )
    } );

    const earthNode = new EarthNode( model.barMagnet, {
      visibleProperty: viewProperties.earthVisibleProperty,
      tandem: tandem.createTandem( 'earthNode' )
    } );

    const panelsTandem = tandem.createTandem( 'panels' );

    const barMagnetPanel = new BarMagnetPanel( model.barMagnet, viewProperties.seeInsideBarMagnetProperty,
      model.compass, panelsTandem.createTandem( 'barMagnetPanel' ) );

    const visibilityPanel = new BarMagnetVisibilityPanel(
      viewProperties.fieldVisibleProperty,
      viewProperties.compassVisibleProperty,
      viewProperties.fieldMeterVisibleProperty,
      viewProperties.earthVisibleProperty,
      panelsTandem.createTandem( 'visibilityPanel' )
    );

    const panels = new VBox( {
      stretch: true,
      spacing: 10,
      children: [
        barMagnetPanel,
        visibilityPanel
      ],
      tandem: panelsTandem,
      phetioVisiblePropertyInstrumented: true
    } );

    // Adjust position of the control panels
    Multilink.multilink( [ panels.boundsProperty, this.visibleBoundsProperty ],
      ( panelsBounds, visibleBounds ) => {
        panels.right = visibleBounds.right - FELConstants.SCREEN_VIEW_X_MARGIN;
        panels.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        viewProperties.reset();
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
        fieldNode,
        barMagnetNode,
        earthNode,
        compassNode,
        fieldMeterNode,
        panels,
        resetAllButton
      ]
    } );
    this.addChild( rootNode );

    rootNode.pdomOrder = [
      barMagnetNode,
      compassNode,
      fieldMeterNode,
      panels,
      resetAllButton
    ];
  }
}

faradaysElectromagneticLab.register( 'BarMagnetScreenView', BarMagnetScreenView );