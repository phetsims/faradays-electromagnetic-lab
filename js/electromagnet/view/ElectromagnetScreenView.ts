// Copyright 2023, University of Colorado Boulder

/**
 * ElectromagnetScreenView is the top-level view for the 'Electromagnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import ElectromagnetModel from '../model/ElectromagnetModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FieldNode from '../../common/view/FieldNode.js';
import FieldMeterNode from '../../common/view/FieldMeterNode.js';
import CompassNode from '../../common/view/CompassNode.js';
import ElectromagnetViewProperties from './ElectromagnetViewProperties.js';
import { Node, VBox } from '../../../../scenery/js/imports.js';
import Multilink from '../../../../axon/js/Multilink.js';
import ElectromagnetPanel from '../../common/view/ElectromagnetPanel.js';
import PickupCoilVisibilityPanel from '../../pickup-coil/view/PickupCoilVisibilityPanel.js';

export default class ElectromagnetScreenView extends ScreenView {

  public constructor( model: ElectromagnetModel, tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem
    } );

    const viewProperties = new ElectromagnetViewProperties( tandem.createTandem( 'viewProperties' ) );

    const fieldNode = new FieldNode( model.electromagnet, {
      visibleBoundsProperty: this.visibleBoundsProperty,
      visibleProperty: viewProperties.fieldVisibleProperty,
      tandem: tandem.createTandem( 'fieldNode' )
    } );

    //TODO electromagnetNode

    const fieldMeterNode = new FieldMeterNode( model.fieldMeter, tandem.createTandem( 'fieldMeterNode' ) );

    const compassNode = new CompassNode( model.compass, tandem.createTandem( 'compassNode' ) );

    const panelsTandem = tandem.createTandem( 'panels' );

    const electromagnetPanel = new ElectromagnetPanel( model.electromagnet,
      viewProperties.electromagnetElectronsVisibleProperty, tandem.createTandem( 'electromagnetPanel' ) );

    const visibilityPanel = new PickupCoilVisibilityPanel(
      viewProperties.fieldVisibleProperty,
      model.compass.visibleProperty,
      model.fieldMeter.visibleProperty,
      panelsTandem.createTandem( 'visibilityPanel' )
    );

    const panels = new VBox( {
      stretch: true,
      spacing: 10,
      children: [
        electromagnetPanel,
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
        //TODO electromagnetNode
        compassNode,
        fieldMeterNode,
        panels,
        resetAllButton
      ]
    } );
    this.addChild( rootNode );

    rootNode.pdomOrder = [
      //TODO electromagnetNode
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

faradaysElectromagneticLab.register( 'ElectromagnetScreenView', ElectromagnetScreenView );