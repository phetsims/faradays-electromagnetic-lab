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
import DCPowerSupplyPanel from '../../common/view/DCPowerSupplyPanel.js';
import ACPowerSupplyPanel from '../../common/view/ACPowerSupplyPanel.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

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
        dcPowerSupplyPanel.reset();
        acPowerSupplyPanel.reset();
      },
      tandem: tandem
    } );

    const powerSupplyPanelPosition = new Vector2( this.layoutBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN, this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN );

    const powerSupplyPanelDragBoundsProperty = new DerivedProperty(
      [ this.visibleBoundsProperty, rightPanels.boundsProperty ],
      ( visibleBounds, rightPanelsBounds ) => visibleBounds.withMaxX( rightPanelsBounds.left ).erodedXY( 10, 10 ) );

    const dcPowerSupplyPanel = new DCPowerSupplyPanel( electromagnet.dcPowerSupply, electromagnet.currentSourceProperty, {
      position: powerSupplyPanelPosition,
      dragBoundsProperty: powerSupplyPanelDragBoundsProperty,
      tandem: tandem.createTandem( 'dcPowerSupplyPanel' )
    } );

    const acPowerSupplyPanel = new ACPowerSupplyPanel( electromagnet.acPowerSupply, electromagnet.currentSourceProperty, {
      position: powerSupplyPanelPosition,
      dragBoundsProperty: powerSupplyPanelDragBoundsProperty,
      tandem: tandem.createTandem( 'acPowerSupplyPanel' )
    } );

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
        dcPowerSupplyPanel,
        acPowerSupplyPanel,
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
      dcPowerSupplyPanel,
      acPowerSupplyPanel,
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