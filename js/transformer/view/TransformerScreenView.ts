// Copyright 2023-2024, University of Colorado Boulder

/**
 * TransformerScreenView is the top-level view for the 'Transformer' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FELConstants from '../../common/FELConstants.js';
import ACPowerSupplyPanel from '../../common/view/ACPowerSupplyPanel.js';
import DCPowerSupplyPanel from '../../common/view/DCPowerSupplyPanel.js';
import FELScreenView from '../../common/view/FELScreenView.js';
import FELTimeControlNode from '../../common/view/FELTimeControlNode.js';
import PickupCoilAxisNode from '../../common/view/PickupCoilAxisNode.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import TransformerScreenModel from '../model/TransformerScreenModel.js';
import TransformerDeveloperAccordionBox from './TransformerDeveloperAccordionBox.js';
import TransformerNode from './TransformerNode.js';
import TransformerPanels from './TransformerPanels.js';

export default class TransformerScreenView extends FELScreenView {

  public constructor( model: TransformerScreenModel, tandem: Tandem ) {

    // To improve readability
    const electromagnet = model.transformer.electromagnet;
    const pickupCoil = model.transformer.pickupCoil;

    const lockToAxisProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'lockToAxisProperty' ),
      phetioDocumentation: 'When true, dragging the magnet or pickup coil is locked to the pickup coil\'s horizontal axis.'
    } );
    lockToAxisProperty.link( lockToAxis =>
      FELScreenView.lockToAxisListener( lockToAxis, electromagnet.positionProperty, pickupCoil.positionProperty ) );

    const rightPanels = new TransformerPanels( model, lockToAxisProperty, tandem.createTandem( 'rightPanels' ) );

    const timeControlNode = new FELTimeControlNode( model, tandem.createTandem( 'timeControlNode' ) );

    super( {
      magnet: electromagnet,
      compass: model.compass,
      fieldMeter: model.fieldMeter,
      rightPanels: rightPanels,
      timeControlNode: timeControlNode,
      resetAll: () => {
        model.reset();
        lockToAxisProperty.reset();
        dcPowerSupplyPanel.reset();
        acPowerSupplyPanel.reset();
      },
      tandem: tandem
    } );

    // Initial position for both power supply panels.
    const powerSupplyPanelPosition = new Vector2( this.layoutBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN, this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN );

    const dcPowerSupplyPanel = new DCPowerSupplyPanel( electromagnet.dcPowerSupply, electromagnet.currentSourceProperty,
      this.visibleBoundsProperty, rightPanels.boundsProperty, {
        position: powerSupplyPanelPosition,
        tandem: tandem.createTandem( 'dcPowerSupplyPanel' )
      } );

    const acPowerSupplyPanel = new ACPowerSupplyPanel( electromagnet.acPowerSupply, electromagnet.currentSourceProperty,
      this.visibleBoundsProperty, rightPanels.boundsProperty, {
        position: powerSupplyPanelPosition,
        tandem: tandem.createTandem( 'acPowerSupplyPanel' )
      } );

    const transformerDragBoundsProperty = FELScreenView.createDragBoundsPropertyForLockToAxis( lockToAxisProperty,
      this.layoutBounds, rightPanels.boundsProperty, pickupCoil.positionProperty );

    const transformerNode = new TransformerNode( model.transformer, transformerDragBoundsProperty, lockToAxisProperty,
      tandem.createTandem( 'transformerNode' ) );

    const pickupCoilAxisNode = new PickupCoilAxisNode( lockToAxisProperty, pickupCoil.positionProperty,
      this.visibleBoundsProperty );

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
        this.resetAllButton
      ]
    } );
    this.addChild( screenViewRootNode );

    if ( phet.chipper.queryParameters.dev ) {
      this.addDeveloperAccordionBox( new TransformerDeveloperAccordionBox( model.transformer ) );
      this.addPickupCoilDebuggerPanel( pickupCoil );
    }

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