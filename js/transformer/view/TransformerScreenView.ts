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
import Property from '../../../../axon/js/Property.js';
import TransformerNode from './TransformerNode.js';
import DCPowerSupplyPanel from '../../common/view/DCPowerSupplyPanel.js';
import ACPowerSupplyPanel from '../../common/view/ACPowerSupplyPanel.js';
import Multilink from '../../../../axon/js/Multilink.js';

export default class TransformerScreenView extends FELScreenView {

  public constructor( model: TransformerScreenModel, tandem: Tandem ) {

    // To improve readability
    const electromagnet = model.transformer.electromagnet;
    const pickupCoil = model.transformer.pickupCoil;

    const isLockedToAxisProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isLockedToAxisProperty' ),
      phetioDocumentation: 'When true, dragging the magnet or pickup coil is locked to the pickup coil\'s horizontal axis.'
    } );

    const panels = new TransformerPanels( model, isLockedToAxisProperty, tandem.createTandem( 'panels' ) );

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

    // Set to correct bounds by calling this.configureDragBoundsProperty below.
    const dragBoundsProperty = new Property( this.layoutBounds );

    const transformerNode = new TransformerNode( model.transformer, dragBoundsProperty,
      tandem.createTandem( 'transformerNode' ) );

    //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/163 Studio tree structure for dcPowerSupplyPanel and acPowerSupplyPanel
    const dcPowerSupplyPanel = new DCPowerSupplyPanel( electromagnet.dcPowerSupply, electromagnet.currentSourceProperty,
      tandem.createTandem( 'dcPowerSupplyPanel' ) );

    const acPowerSupplyPanel = new ACPowerSupplyPanel( electromagnet.acPowerSupply, electromagnet.currentSourceProperty,
      tandem.createTandem( 'acPowerSupplyPanel' ) );

    // Panels top-aligned with layoutBounds, left-aligned with visible bounds.
    Multilink.multilink( [ this.visibleBoundsProperty, dcPowerSupplyPanel.boundsProperty ],
      ( visibleBounds, panelsBounds ) => {
        dcPowerSupplyPanel.left = visibleBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN;
        dcPowerSupplyPanel.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );
    Multilink.multilink( [ this.visibleBoundsProperty, acPowerSupplyPanel.boundsProperty ],
      ( visibleBounds, panelsBounds ) => {
        acPowerSupplyPanel.left = visibleBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN;
        acPowerSupplyPanel.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );

    this.configureDragBoundsProperty( dragBoundsProperty, isLockedToAxisProperty, panels.boundsProperty,
      electromagnet.positionProperty, pickupCoil.positionProperty, transformerNode.electromagnetNode,
      transformerNode.pickupCoilNode );

    const pickupCoilAxisNode = new PickupCoilAxisNode( isLockedToAxisProperty, pickupCoil.positionProperty,
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
        panels,
        dcPowerSupplyPanel,
        acPowerSupplyPanel,
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
      panels.electromagnetPanel,
      panels.pickupCoilPanel
    ];

    // Control Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomControlAreaNode.pdomOrder = [
      panels.toolsPanel,
      timeControlNode,
      this.resetAllButton
    ];
  }
}

faradaysElectromagneticLab.register( 'TransformerScreenView', TransformerScreenView );