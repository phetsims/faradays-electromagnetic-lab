// Copyright 2023-2024, University of Colorado Boulder

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
import { Node } from '../../../../scenery/js/imports.js';
import Multilink from '../../../../axon/js/Multilink.js';
import GeneratorDeveloperAccordionBox from './GeneratorDeveloperAccordionBox.js';
import PickupCoilDebuggerPanel from '../../common/view/PickupCoilDebuggerPanel.js';
import PickupCoilNode from '../../common/view/PickupCoilNode.js';
import TurbineNode from './TurbineNode.js';
import FELTimeControlNode from '../../common/view/FELTimeControlNode.js';
import GeneratorPanels from './GeneratorPanels.js';

export default class GeneratorScreenView extends ScreenView {

  public constructor( model: GeneratorModel, tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem
    } );

    const fieldNode = new FieldNode( model.turbine, {
      visibleBoundsProperty: this.visibleBoundsProperty,
      tandem: tandem.createTandem( 'fieldNode' )
    } );

    const turbineNode = new TurbineNode( model.turbine, this.layoutBounds, this.visibleBoundsProperty,
      tandem.createTandem( 'turbineNode' ) );

    const pickupCoilNode = new PickupCoilNode( model.pickupCoil, model.stepEmitter, {
      tandem: tandem.createTandem( 'pickupCoilNode' ),
      isMovable: false // pickupCoilNode is not movable in this screen.
    } );

    const pickupCoilDebuggerPanel = new PickupCoilDebuggerPanel( model.pickupCoil );
    pickupCoilDebuggerPanel.centerX = this.layoutBounds.centerX;
    pickupCoilDebuggerPanel.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;

    const fieldMeterNode = new FieldMeterNode( model.fieldMeter, tandem.createTandem( 'fieldMeterNode' ) );

    const compassNode = new CompassNode( model.compass, tandem.createTandem( 'compassNode' ) );

    const panels = new GeneratorPanels( model.turbine, model.pickupCoil, model.compass, model.fieldMeter,
      tandem.createTandem( 'panels' ) );

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
    const developerAccordionBox = new GeneratorDeveloperAccordionBox( model, !!phet.chipper.queryParameters.dev );
    Multilink.multilink( [ developerAccordionBox.boundsProperty, this.visibleBoundsProperty ],
      ( bounds, visibleBounds ) => {
        developerAccordionBox.left = visibleBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN;
        developerAccordionBox.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );

    const rootNode = new Node( {
      children: [
        pickupCoilNode.backgroundNode,
        fieldNode,
        turbineNode,
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
      turbineNode,
      compassNode,
      fieldMeterNode,
      panels,
      timeControlNode,
      resetAllButton
      // Exclude developerAccordionBox and pickupCoilDebuggerPanel from alt input.
    ];
  }
}

faradaysElectromagneticLab.register( 'GeneratorScreenView', GeneratorScreenView );