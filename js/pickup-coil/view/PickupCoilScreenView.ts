// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoilScreenView is the top-level view for the 'Pickup Coil' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FieldNode from '../../common/view/FieldNode.js';
import BarMagnetNode from '../../common/view/BarMagnetNode.js';
import FieldMeterNode from '../../common/view/FieldMeterNode.js';
import CompassNode from '../../common/view/CompassNode.js';
import BarMagnetPanel from '../../common/view/BarMagnetPanel.js';
import { Node, VBox } from '../../../../scenery/js/imports.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PickupCoilViewProperties from './PickupCoilViewProperties.js';
import PickupCoilVisibilityPanel from './PickupCoilVisibilityPanel.js';
import PickupCoilPanel from '../../common/view/PickupCoilPanel.js';
import PickupCoilModel from '../model/PickupCoilModel.js';

export default class PickupCoilScreenView extends ScreenView {

  public constructor( model: PickupCoilModel, tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem
    } );

    const viewProperties = new PickupCoilViewProperties( tandem.createTandem( 'viewProperties' ) );

    const fieldNode = new FieldNode( model.barMagnet, {
      visibleBoundsProperty: this.visibleBoundsProperty,
      visibleProperty: viewProperties.fieldVisibleProperty,
      tandem: tandem.createTandem( 'fieldNode' )
    } );

    const barMagnetNode = new BarMagnetNode( model.barMagnet, {
      tandem: tandem.createTandem( 'barMagnetNode' )
    } );

    //TODO pickupCoilNode

    const fieldMeterNode = new FieldMeterNode( model.fieldMeter, {
      visibleProperty: viewProperties.fieldMeterVisibleProperty,
      tandem: tandem.createTandem( 'fieldMeterNode' )
    } );

    const compassNode = new CompassNode( model.compass, {
      visibleProperty: viewProperties.compassVisibleProperty,
      tandem: tandem.createTandem( 'compassNode' )
    } );

    const panelsTandem = tandem.createTandem( 'panels' );

    const barMagnetPanel = new BarMagnetPanel( model.barMagnet, model.compass, {
      tandem: panelsTandem.createTandem( 'barMagnetPanel' )
    } );

    const pickupCoilPanel = new PickupCoilPanel( model.pickupCoil, viewProperties.indicatorProperty,
      viewProperties.pickupCoilElectronsVisibleProperty, panelsTandem.createTandem( 'pickupCoilPanel' ) );

    const visibilityPanel = new PickupCoilVisibilityPanel(
      viewProperties.fieldVisibleProperty,
      viewProperties.compassVisibleProperty,
      viewProperties.fieldMeterVisibleProperty,
      panelsTandem.createTandem( 'visibilityPanel' )
    );

    const panels = new VBox( {
      stretch: true,
      spacing: 10,
      children: [
        barMagnetPanel,
        pickupCoilPanel,
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
        //TODO pickupCoilNode
        compassNode,
        fieldMeterNode,
        panels,
        resetAllButton
      ]
    } );
    this.addChild( rootNode );

    rootNode.pdomOrder = [
      barMagnetNode,
      //TODO pickupCoilNode
      compassNode,
      fieldMeterNode,
      panels,
      resetAllButton
    ];
  }
}

faradaysElectromagneticLab.register( 'PickupCoilScreenView', PickupCoilScreenView );