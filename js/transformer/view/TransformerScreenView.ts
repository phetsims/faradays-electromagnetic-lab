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
import { Node, VBox } from '../../../../scenery/js/imports.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PickupCoilPanel from '../../common/view/PickupCoilPanel.js';
import TransformerDeveloperAccordionBox from './TransformerDeveloperAccordionBox.js';
import ToolsPanel from '../../common/view/ToolsPanel.js';
import PickupCoilDebuggerPanel from '../../common/view/PickupCoilDebuggerPanel.js';
import PickupCoilNode from '../../common/view/PickupCoilNode.js';
import FELTimeControlNode from '../../common/view/FELTimeControlNode.js';
import ElectromagnetNode from '../../common/view/ElectromagnetNode.js';

export default class TransformerScreenView extends ScreenView {

  public constructor( model: TransformerModel, tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem
    } );

    const fieldNode = new FieldNode( model.electromagnet, {
      visibleBoundsProperty: this.visibleBoundsProperty,
      tandem: tandem.createTandem( 'fieldNode' )
    } );

    const electromagnetNode = new ElectromagnetNode( model.electromagnet, tandem.createTandem( 'electromagnetNode' ) );

    const pickupCoilNode = new PickupCoilNode( model.pickupCoil, model.stepEmitter, {
      tandem: tandem.createTandem( 'pickupCoilNode' )
    } );

    const pickupCoilDebuggerPanel = new PickupCoilDebuggerPanel( model.pickupCoil );
    pickupCoilDebuggerPanel.centerX = this.layoutBounds.centerX;
    pickupCoilDebuggerPanel.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;

    const fieldMeterNode = new FieldMeterNode( model.fieldMeter, tandem.createTandem( 'fieldMeterNode' ) );

    const compassNode = new CompassNode( model.compass, tandem.createTandem( 'compassNode' ) );

    const panelsTandem = tandem.createTandem( 'panels' );

    const electromagnetPanel = new ElectromagnetPanel( model.electromagnet, tandem.createTandem( 'electromagnetPanel' ) );

    const pickupCoilPanel = new PickupCoilPanel( model.pickupCoil, panelsTandem.createTandem( 'pickupCoilPanel' ) );

    const toolsPanel = new ToolsPanel( model.compass, model.fieldMeter, panelsTandem.createTandem( 'toolsPanel' ) );

    const panels = new VBox( {
      stretch: true,
      spacing: 10,
      children: [
        electromagnetPanel,
        pickupCoilPanel,
        toolsPanel
      ],
      tandem: panelsTandem,
      phetioVisiblePropertyInstrumented: true
    } );

    // Adjust position of the control panels
    Multilink.multilink( [ this.visibleBoundsProperty, panels.boundsProperty ],
      ( visibleBounds, panelsBounds ) => {
        panels.right = visibleBounds.right - FELConstants.SCREEN_VIEW_X_MARGIN;
        panels.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );

    const timeControlNode = new FELTimeControlNode( model, tandem.createTandem( 'timeControlNode' ) );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    Multilink.multilink( [ this.visibleBoundsProperty, panels.boundsProperty ],
      ( visibleBounds, panelsBounds ) => {

        // resetAllButton in right bottom corner
        resetAllButton.right = visibleBounds.maxX - FELConstants.SCREEN_VIEW_X_MARGIN;
        resetAllButton.bottom = visibleBounds.maxY - FELConstants.SCREEN_VIEW_Y_MARGIN;

        // timeControlNode to the left of resetAllButton
        timeControlNode.left = panelsBounds.left;
        timeControlNode.centerY = resetAllButton.centerY;
      } );

    // Developer controls are always created, to prevent them from becoming broken over time.
    // But they are visible only when running with &dev query parameter.
    const developerAccordionBox = new TransformerDeveloperAccordionBox( model, !!phet.chipper.queryParameters.dev );
    Multilink.multilink( [ developerAccordionBox.boundsProperty, this.visibleBoundsProperty ],
      ( bounds, visibleBounds ) => {
        developerAccordionBox.left = visibleBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN;
        developerAccordionBox.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );

    const rootNode = new Node( {
      children: [
        pickupCoilNode.backgroundNode,
        fieldNode,
        electromagnetNode,
        pickupCoilNode,
        compassNode,
        fieldMeterNode,
        panels,
        timeControlNode,
        resetAllButton,
        developerAccordionBox,
        pickupCoilDebuggerPanel
      ]
    } );
    this.addChild( rootNode );

    rootNode.pdomOrder = [
      electromagnetNode,
      pickupCoilNode,
      compassNode,
      fieldMeterNode,
      panels,
      timeControlNode,
      resetAllButton
      // Exclude developerAccordionBox and pickupCoilDebuggerPanel from alt input.
    ];
  }
}

faradaysElectromagneticLab.register( 'TransformerScreenView', TransformerScreenView );