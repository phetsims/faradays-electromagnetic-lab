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
import PickupCoilModel from '../model/PickupCoilModel.js';
import PickupCoilDeveloperAccordionBox from './PickupCoilDeveloperAccordionBox.js';
import PickupCoilDebuggerPanel from '../../common/view/PickupCoilDebuggerPanel.js';
import PickupCoilNode from '../../common/view/PickupCoilNode.js';
import PickupCoilPanels from './PickupCoilPanels.js';
import FELScreenView from '../../common/view/FELScreenView.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PickupCoilAxisNode from '../../common/view/PickupCoilAxisNode.js';
import Property from '../../../../axon/js/Property.js';

export default class PickupCoilScreenView extends FELScreenView {

  public constructor( model: PickupCoilModel, tandem: Tandem ) {

    const isLockedToAxisProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isLockedToAxisProperty' ),
      phetioDocumentation: 'When true, dragging the magnet or pickup coil is locked to the pickup coil\'s horizontal axis.'
    } );

    const panels = new PickupCoilPanels( model.barMagnet, model.pickupCoil, model.compass, model.fieldMeter,
      isLockedToAxisProperty, tandem.createTandem( 'panels' ) );

    const developerAccordionBox = new PickupCoilDeveloperAccordionBox( model.barMagnet, model.pickupCoil );

    super( {
      magnet: model.barMagnet,
      compass: model.compass,
      fieldMeter: model.fieldMeter,
      panels: panels,
      developerAccordionBox: developerAccordionBox,
      resetAll: () => {
        model.reset();
        isLockedToAxisProperty.reset();
      },
      tandem: tandem
    } );

    // Will be set to correct bounds by configureDragBoundsProperty below.
    const dragBoundsProperty = new Property( this.layoutBounds );

    const barMagnetNode = new BarMagnetNode( model.barMagnet, {
      dragBoundsProperty: dragBoundsProperty,
      tandem: tandem.createTandem( 'barMagnetNode' )
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
      model.barMagnet.positionProperty, model.pickupCoil.positionProperty, barMagnetNode, pickupCoilNode );

    const rootNode = new Node( {
      children: [
        pickupCoilNode.backgroundNode,
        this.fieldNode,
        pickupCoilAxisNode,
        this.compassNode, // behind barMagnetNode, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/10#issuecomment-1911160748
        barMagnetNode,
        pickupCoilNode,
        panels,
        this.fieldMeterNode,
        this.resetAllButton,
        developerAccordionBox,
        pickupCoilDebuggerPanel
      ]
    } );
    this.addChild( rootNode );

    rootNode.pdomOrder = [
      barMagnetNode,
      pickupCoilNode,
      this.compassNode,
      this.fieldMeterNode,
      panels,
      this.resetAllButton
      // Exclude developerAccordionBox from alt input because it is present it is not part of the production UI.
    ];
  }
}

faradaysElectromagneticLab.register( 'PickupCoilScreenView', PickupCoilScreenView );