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
import FELTimeControlNode from '../../common/view/FELTimeControlNode.js';
import TransformerPanels from './TransformerPanels.js';
import FELScreenView from '../../common/view/FELScreenView.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PickupCoilAxisNode from '../../common/view/PickupCoilAxisNode.js';
import Property from '../../../../axon/js/Property.js';
import TransformerNode from './TransformerNode.js';

export default class TransformerScreenView extends FELScreenView {

  public constructor( model: TransformerModel, tandem: Tandem ) {

    // To improve readability
    const electromagnet = model.transformer.electromagnet;
    const pickupCoil = model.transformer.pickupCoil;

    const isLockedToAxisProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isLockedToAxisProperty' ),
      phetioDocumentation: 'When true, dragging the magnet or pickup coil is locked to the pickup coil\'s horizontal axis.'
    } );

    const panels = new TransformerPanels( model.transformer, model.compass, model.fieldMeter,
      isLockedToAxisProperty, tandem.createTandem( 'panels' ) );

    const timeControlNode = new FELTimeControlNode( model, tandem.createTandem( 'timeControlNode' ) );

    const developerAccordionBox = new TransformerDeveloperAccordionBox( model.transformer );

    super( {
      magnet: electromagnet,
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

    const transformerNode = new TransformerNode( model.transformer, model.stepEmitter, dragBoundsProperty,
      tandem.createTandem( 'transformerNode' ) );

    this.configureDragBoundsProperty( dragBoundsProperty, isLockedToAxisProperty, panels.boundsProperty,
      electromagnet.positionProperty, pickupCoil.positionProperty, transformerNode.electromagnetNode,
      transformerNode.pickupCoilNode );

    const pickupCoilAxisNode = new PickupCoilAxisNode( isLockedToAxisProperty, pickupCoil.positionProperty,
      this.visibleBoundsProperty );

    const pickupCoilDebuggerPanel = new PickupCoilDebuggerPanel( pickupCoil );
    pickupCoilDebuggerPanel.centerX = this.layoutBounds.centerX;
    pickupCoilDebuggerPanel.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;

    // Rendering order, from back to front
    const rootNode = new Node( {
      children: [
        transformerNode.pickupCoilNode.backgroundNode,
        transformerNode.electromagnetNode.backgroundNode,
        this.fieldNode,
        pickupCoilAxisNode,
        this.compassNode, // behind transformerNode, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/10#issuecomment-1911160748
        transformerNode,
        panels,
        this.fieldMeterNode,
        timeControlNode,
        this.resetAllButton,
        developerAccordionBox,
        pickupCoilDebuggerPanel
      ]
    } );
    this.addChild( rootNode );

    // The order of focusable elements in the DOM
    rootNode.pdomOrder = [
      transformerNode.electromagnetNode,
      transformerNode.pickupCoilNode,
      this.compassNode,
      this.fieldMeterNode,
      panels,
      timeControlNode,
      this.resetAllButton
      // Exclude developerAccordionBox because it is not part of the production UI.
    ];
  }
}

faradaysElectromagneticLab.register( 'TransformerScreenView', TransformerScreenView );