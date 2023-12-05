// Copyright 2023, University of Colorado Boulder

/**
 * TransformerScreenView is the top-level view for the 'Transformer' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import TransformerModel from '../model/TransformerModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FieldNode from '../../common/view/FieldNode.js';
import FieldMeterNode from '../../common/view/FieldMeterNode.js';
import CompassNode from '../../common/view/CompassNode.js';
import ElectromagnetPanel from '../../common/view/ElectromagnetPanel.js';
import PickupCoilVisibilityPanel from '../../pickup-coil/view/PickupCoilVisibilityPanel.js';
import { Node, VBox } from '../../../../scenery/js/imports.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TransformerViewProperties from './TransformerViewProperties.js';
import PickupCoilPanel from '../../common/view/PickupCoilPanel.js';

export default class TransformerScreenView extends ScreenView {

  public constructor( model: TransformerModel, tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    const viewProperties = new TransformerViewProperties( tandem.createTandem( 'viewProperties' ) );

    const fieldNode = new FieldNode( model.electromagnet, {
      visibleBoundsProperty: this.visibleBoundsProperty,
      visibleProperty: viewProperties.fieldVisibleProperty,
      tandem: tandem.createTandem( 'fieldNode' )
    } );

    //TODO electromagnetNode

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

    const electromagnetPanel = new ElectromagnetPanel( model.electromagnet,
      viewProperties.electromagnetElectronsVisibleProperty, tandem.createTandem( 'electromagnetPanel' ) );

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
        electromagnetPanel,
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
        //TODO viewProperties.reset();
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
        //TODO electromagnetNode
        //TODO pickupCoilNode
        compassNode,
        fieldMeterNode,
        panels,
        resetAllButton
      ]
    } );
    this.addChild( rootNode );

    rootNode.pdomOrder = [
      //TODO electromagnetNode
      //TODO pickupCoilNode
      compassNode,
      fieldMeterNode,
      panels,
      resetAllButton
    ];
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    //TODO
  }
}

faradaysElectromagneticLab.register( 'TransformerScreenView', TransformerScreenView );