// Copyright 2023-2024, University of Colorado Boulder

/**
 * TransformerScreenView is the top-level view for the 'Transformer' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import TransformerModel from '../model/TransformerModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';
import TransformerDeveloperAccordionBox from './TransformerDeveloperAccordionBox.js';
import PickupCoilDebuggerPanel from '../../common/view/PickupCoilDebuggerPanel.js';
import PickupCoilNode from '../../common/view/PickupCoilNode.js';
import FELTimeControlNode from '../../common/view/FELTimeControlNode.js';
import ElectromagnetNode from '../../common/view/ElectromagnetNode.js';
import TransformerPanels from './TransformerPanels.js';
import FELScreenView from '../../common/view/FELScreenView.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PickupCoilAxisNode from '../../common/view/PickupCoilAxisNode.js';
import Property from '../../../../axon/js/Property.js';

export default class TransformerScreenView extends FELScreenView {

  public constructor( model: TransformerModel, tandem: Tandem ) {

    const isLockedToAxisProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isLockedToAxisProperty' ),
      phetioDocumentation: 'When true, dragging the magnet or pickup coil is locked to the pickup coil\'s horizontal axis.'
    } );

    const panels = new TransformerPanels( model.electromagnet, model.pickupCoil, model.compass, model.fieldMeter,
      isLockedToAxisProperty, tandem.createTandem( 'panels' ) );

    const timeControlNode = new FELTimeControlNode( model, tandem.createTandem( 'timeControlNode' ) );

    // Developer controls are always created, to prevent them from becoming broken over time.
    // But they are visible only when running with &dev query parameter.
    const developerAccordionBox = new TransformerDeveloperAccordionBox( model, !!phet.chipper.queryParameters.dev );

    super( {
      magnet: model.electromagnet,
      compass: model.compass,
      fieldMeter: model.fieldMeter,
      panels: panels,
      timeControlNode: timeControlNode,
      developerAccordionBox: developerAccordionBox,
      resetAll: () => {
        model.reset();
        isLockedToAxisProperty.reset();
      },
      tandem: tandem
    } );

    // Will be set to correct bounds by configureDragBoundsProperty below.
    const dragBoundsProperty = new Property( this.layoutBounds );

    const electromagnetNode = new ElectromagnetNode( model.electromagnet, model.stepEmitter, {
      dragBoundsProperty: dragBoundsProperty,
      tandem: tandem.createTandem( 'electromagnetNode' )
    } );

    const pickupCoilNode = new PickupCoilNode( model.pickupCoil, model.stepEmitter, {
      dragBoundsProperty: dragBoundsProperty,
      tandem: tandem.createTandem( 'pickupCoilNode' )
    } );

    const pickupCoilAxisNode = new PickupCoilAxisNode( isLockedToAxisProperty, model.pickupCoil.positionProperty,
      this.visibleBoundsProperty );

    const pickupCoilDebuggerPanel = new PickupCoilDebuggerPanel( model.pickupCoil );
    pickupCoilDebuggerPanel.centerX = this.layoutBounds.centerX;
    pickupCoilDebuggerPanel.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;

    this.configureDragBoundsProperty( dragBoundsProperty, isLockedToAxisProperty, panels.boundsProperty,
      model.electromagnet.positionProperty, model.pickupCoil.positionProperty, electromagnetNode, pickupCoilNode );

    const rootNode = new Node( {
      children: [
        pickupCoilNode.backgroundNode,
        electromagnetNode.backgroundNode,
        this.fieldNode,
        pickupCoilAxisNode,
        electromagnetNode,
        pickupCoilNode,
        panels,
        this.compassNode,
        this.fieldMeterNode,
        timeControlNode,
        this.resetAllButton,
        developerAccordionBox,
        pickupCoilDebuggerPanel
      ]
    } );
    this.addChild( rootNode );

    rootNode.pdomOrder = [
      electromagnetNode,
      pickupCoilNode,
      this.compassNode,
      this.fieldMeterNode,
      panels,
      timeControlNode,
      this.resetAllButton
      // Exclude developerAccordionBox from alt input because it is present it is not part of the production UI.
    ];
  }
}

faradaysElectromagneticLab.register( 'TransformerScreenView', TransformerScreenView );