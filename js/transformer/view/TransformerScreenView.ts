// Copyright 2023-2024, University of Colorado Boulder

/**
 * TransformerScreenView is the top-level view for the 'Transformer' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import TransformerScreenModel from '../model/TransformerScreenModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';
import TransformerDeveloperAccordionBox from './TransformerDeveloperAccordionBox.js';
import PickupCoilDebuggerPanel from '../../common/view/PickupCoilDebuggerPanel.js';
import FELTimeControlNode from '../../common/view/FELTimeControlNode.js';
import TransformerPanels from './TransformerPanels.js';
import FELScreenView from '../../common/view/FELScreenView.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PickupCoilAxisNode from '../../common/view/PickupCoilAxisNode.js';
import TransformerNode from './TransformerNode.js';
import PowerSupplyPanels from '../../common/view/PowerSupplyPanels.js';

export default class TransformerScreenView extends FELScreenView {

  public constructor( model: TransformerScreenModel, tandem: Tandem ) {

    // To improve readability
    const electromagnet = model.transformer.electromagnet;
    const pickupCoil = model.transformer.pickupCoil;

    const lockToAxisProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'lockToAxisProperty' ),
      phetioDocumentation: 'When true, dragging the magnet or pickup coil is locked to the pickup coil\'s horizontal axis.'
    } );

    const rightPanels = new TransformerPanels( model, lockToAxisProperty, tandem.createTandem( 'rightPanels' ) );

    const timeControlNode = new FELTimeControlNode( model, tandem.createTandem( 'timeControlNode' ) );

    const developerAccordionBox = new TransformerDeveloperAccordionBox( model.transformer );

    super( {
      magnet: electromagnet,
      compass: model.compass,
      fieldMeter: model.fieldMeter,
      rightPanels: rightPanels,
      timeControlNode: timeControlNode,
      developerAccordionBox: developerAccordionBox,
      resetAll: () => {
        model.reset();
        lockToAxisProperty.reset();
      },
      tandem: tandem
    } );

    const powerSupplyPanels = new PowerSupplyPanels( electromagnet.currentSourceProperty, electromagnet.dcPowerSupply,
      electromagnet.acPowerSupply, tandem.createTandem( 'powerSupplyPanels' ) );
    powerSupplyPanels.left = this.layoutBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN;
    powerSupplyPanels.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;

    const dragBoundsProperty = FELScreenView.createDragBoundsPropertyForLockToAxis( lockToAxisProperty,
      this.layoutBounds, rightPanels.boundsProperty, electromagnet.positionProperty, pickupCoil.positionProperty );

    const transformerNode = new TransformerNode( model.transformer, dragBoundsProperty, lockToAxisProperty,
      tandem.createTandem( 'transformerNode' ) );

    const pickupCoilAxisNode = new PickupCoilAxisNode( lockToAxisProperty, pickupCoil.positionProperty,
      this.visibleBoundsProperty );

    const pickupCoilDebuggerPanel = new PickupCoilDebuggerPanel( pickupCoil, {
      left: this.layoutBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.bottom - FELConstants.SCREEN_VIEW_Y_MARGIN
    } );

    // Rendering order, from back to front.
    const screenViewRootNode = new Node( {
      children: [
        transformerNode.pickupCoilNode.backgroundNode,
        transformerNode.electromagnetNode.backgroundNode,
        this.fieldNode,
        pickupCoilAxisNode,
        this.compassNode, // behind transformerNode, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/10#issuecomment-1911160748
        transformerNode,
        powerSupplyPanels,
        rightPanels,
        this.fieldMeterNode,
        timeControlNode,
        this.resetAllButton,
        developerAccordionBox,
        pickupCoilDebuggerPanel
      ]
    } );
    this.addChild( screenViewRootNode );

    // Play Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomPlayAreaNode.pdomOrder = [
      transformerNode.electromagnetNode,
      powerSupplyPanels,
      transformerNode.pickupCoilNode,
      this.compassNode,
      this.fieldMeterNode,
      rightPanels.electromagnetPanel,
      rightPanels.pickupCoilPanel
    ];

    // Control Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomControlAreaNode.pdomOrder = [
      rightPanels.toolsPanel,
      timeControlNode,
      this.resetAllButton
    ];
  }
}

faradaysElectromagneticLab.register( 'TransformerScreenView', TransformerScreenView );