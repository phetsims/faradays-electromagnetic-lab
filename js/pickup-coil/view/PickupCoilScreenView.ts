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
import PickupCoilVisibilityPanel from './PickupCoilVisibilityPanel.js';
import PickupCoilPanel from '../../common/view/PickupCoilPanel.js';
import PickupCoilModel from '../model/PickupCoilModel.js';
import PickupCoilDeveloperAccordionBox from './PickupCoilDeveloperAccordionBox.js';
import FluxDisplayNode from '../../common/view/FluxDisplayNode.js';

export default class PickupCoilScreenView extends ScreenView {

  public constructor( model: PickupCoilModel, tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem
    } );

    const fieldNode = new FieldNode( model.barMagnet, {
      visibleBoundsProperty: this.visibleBoundsProperty,
      tandem: tandem.createTandem( 'fieldNode' )
    } );

    const barMagnetNode = new BarMagnetNode( model.barMagnet, {
      tandem: tandem.createTandem( 'barMagnetNode' )
    } );

    //TODO pickupCoilNode

    const fluxDisplayNode = new FluxDisplayNode( model.pickupCoil );
    fluxDisplayNode.centerX = this.layoutBounds.centerX;
    fluxDisplayNode.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;

    const fieldMeterNode = new FieldMeterNode( model.fieldMeter, tandem.createTandem( 'fieldMeterNode' ) );

    const compassNode = new CompassNode( model.compass, tandem.createTandem( 'compassNode' ) );

    const panelsTandem = tandem.createTandem( 'panels' );

    const barMagnetPanel = new BarMagnetPanel( model.barMagnet, model.compass, {
      tandem: panelsTandem.createTandem( 'barMagnetPanel' )
    } );

    const pickupCoilPanel = new PickupCoilPanel( model.pickupCoil, panelsTandem.createTandem( 'pickupCoilPanel' ) );

    const visibilityPanel = new PickupCoilVisibilityPanel(
      model.barMagnet.fieldVisibleProperty,
      model.compass.visibleProperty,
      model.fieldMeter.visibleProperty,
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
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.visibleBoundsProperty.link( visibleBounds => {
      resetAllButton.right = visibleBounds.maxX - FELConstants.SCREEN_VIEW_X_MARGIN;
      resetAllButton.bottom = visibleBounds.maxY - FELConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    // Developer controls are always created, to prevent them from becoming broken over time.
    // But they are visible only when running with &dev query parameter.
    const developerAccordionBox = new PickupCoilDeveloperAccordionBox( model, !!phet.chipper.queryParameters.dev );
    Multilink.multilink( [ developerAccordionBox.boundsProperty, this.visibleBoundsProperty ],
      ( bounds, visibleBounds ) => {
        developerAccordionBox.left = visibleBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN;
        developerAccordionBox.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );

    const rootNode = new Node( {
      children: [
        fieldNode,
        barMagnetNode,
        //TODO pickupCoilNode
        compassNode,
        fieldMeterNode,
        panels,
        resetAllButton,
        developerAccordionBox,
        fluxDisplayNode
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
      // Exclude developerAccordionBox and fluxDisplayNode from alt input.
    ];
  }
}

faradaysElectromagneticLab.register( 'PickupCoilScreenView', PickupCoilScreenView );