// Copyright 2023-2024, University of Colorado Boulder

/**
 * PickupCoilScreenView is the top-level view for the 'Pickup Coil' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnetNode from '../../common/view/BarMagnetNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import PickupCoilScreenModel from '../model/PickupCoilScreenModel.js';
import PickupCoilDeveloperAccordionBox from './PickupCoilDeveloperAccordionBox.js';
import PickupCoilDebuggerPanel from '../../common/view/PickupCoilDebuggerPanel.js';
import PickupCoilNode from '../../common/view/PickupCoilNode.js';
import PickupCoilPanels from './PickupCoilPanels.js';
import FELScreenView from '../../common/view/FELScreenView.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PickupCoilAxisNode from '../../common/view/PickupCoilAxisNode.js';
import FELPreferences from '../../common/model/FELPreferences.js';

export default class PickupCoilScreenView extends FELScreenView {

  public constructor( model: PickupCoilScreenModel, preferences: FELPreferences, tandem: Tandem ) {

    const lockToAxisProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'lockToAxisProperty' ),
      phetioDocumentation: 'When true, dragging the magnet or pickup coil is locked to the pickup coil\'s horizontal axis.'
    } );

    const rightPanels = new PickupCoilPanels( model, lockToAxisProperty, tandem.createTandem( 'rightPanels' ) );

    const developerAccordionBox = new PickupCoilDeveloperAccordionBox( model.barMagnet, model.pickupCoil );

    super( {
      magnet: model.barMagnet,
      compass: model.compass,
      fieldMeter: model.fieldMeter,
      rightPanels: rightPanels,
      developerAccordionBox: developerAccordionBox,
      resetAll: () => {
        model.reset();
        lockToAxisProperty.reset();
      },
      tandem: tandem
    } );

    const dragBoundsProperty = FELScreenView.createDragBoundsPropertyForLockToAxis( lockToAxisProperty,
      this.layoutBounds, rightPanels.boundsProperty, model.barMagnet.positionProperty, model.pickupCoil.positionProperty );

    const barMagnetNode = new BarMagnetNode( model.barMagnet, {
      dragBoundsProperty: dragBoundsProperty,
      tandem: tandem.createTandem( 'barMagnetNode' )
    } );

    const pickupCoilNode = new PickupCoilNode( model.pickupCoil, {
      dragBoundsProperty: dragBoundsProperty,
      lockToAxisProperty: lockToAxisProperty,
      tandem: tandem.createTandem( 'pickupCoilNode' )
    } );

    const pickupCoilAxisNode = new PickupCoilAxisNode( lockToAxisProperty, model.pickupCoil.positionProperty,
      this.visibleBoundsProperty );

    const pickupCoilDebuggerPanel = new PickupCoilDebuggerPanel( model.pickupCoil, {
      left: this.layoutBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.bottom - FELConstants.SCREEN_VIEW_Y_MARGIN
    } );

    // Rendering order, from back to front
    const screenViewRootNode = new Node( {
      children: [
        pickupCoilNode.backgroundNode,
        this.fieldNode,
        pickupCoilAxisNode,
        this.compassNode, // behind barMagnetNode, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/10#issuecomment-1911160748
        barMagnetNode,
        pickupCoilNode,
        rightPanels,
        this.fieldMeterNode,
        this.resetAllButton,
        developerAccordionBox,
        pickupCoilDebuggerPanel
      ]
    } );
    this.addChild( screenViewRootNode );

    // Play Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomPlayAreaNode.pdomOrder = [
      barMagnetNode,
      pickupCoilNode,
      this.compassNode,
      this.fieldMeterNode,
      rightPanels.barMagnetPanel,
      rightPanels.pickupCoilPanel
    ];

    // Control Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomControlAreaNode.pdomOrder = [
      rightPanels.toolsPanel,
      this.resetAllButton
    ];
  }
}

faradaysElectromagneticLab.register( 'PickupCoilScreenView', PickupCoilScreenView );