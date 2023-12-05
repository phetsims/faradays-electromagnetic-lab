// Copyright 2023, University of Colorado Boulder

/**
 * GeneratorScreenView is the top-level view for the 'Generator' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import GeneratorModel from '../model/GeneratorModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FieldNode from '../../common/view/FieldNode.js';
import FieldMeterNode from '../../common/view/FieldMeterNode.js';
import CompassNode from '../../common/view/CompassNode.js';
import BarMagnetPanel from '../../common/view/BarMagnetPanel.js';
import PickupCoilPanel from '../../common/view/PickupCoilPanel.js';
import PickupCoilVisibilityPanel from '../../pickup-coil/view/PickupCoilVisibilityPanel.js';
import { Node, VBox } from '../../../../scenery/js/imports.js';
import Multilink from '../../../../axon/js/Multilink.js';
import GeneratorViewProperties from './GeneratorViewProperties.js';

export default class GeneratorScreenView extends ScreenView {

  public constructor( model: GeneratorModel, tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem
    } );

    const viewProperties = new GeneratorViewProperties( tandem.createTandem( 'viewProperties' ) );

    const fieldNode = new FieldNode( model.turbine, {
      visibleBoundsProperty: this.visibleBoundsProperty,
      visibleProperty: viewProperties.fieldVisibleProperty,
      tandem: tandem.createTandem( 'fieldNode' )
    } );

    //TODO turbineNode

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

    const barMagnetPanel = new BarMagnetPanel( model.turbine, model.compass, {
      hasFlipPolarityButton: false,
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
        //TODO turbineNode,
        //TODO pickupCoilNode
        compassNode,
        fieldMeterNode,
        panels,
        resetAllButton
      ]
    } );
    this.addChild( rootNode );

    rootNode.pdomOrder = [
      //TODO turbineNode,
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

faradaysElectromagneticLab.register( 'GeneratorScreenView', GeneratorScreenView );