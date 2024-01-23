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
import Vector2 from '../../../../dot/js/Vector2.js';
import PickupCoilAxisNode from '../../common/view/PickupCoilAxisNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';

export default class PickupCoilScreenView extends FELScreenView {

  public constructor( model: PickupCoilModel, tandem: Tandem ) {

    const isLockedToAxisProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isLockedToAxisProperty' ),
      phetioDocumentation: 'When true, dragging the magnet or pickup coil is locked to the pickup coil\'s horizontal axis.'
    } );

    const panels = new PickupCoilPanels( model.barMagnet, model.pickupCoil, model.compass, model.fieldMeter,
      isLockedToAxisProperty, tandem.createTandem( 'panels' ) );

    // Developer controls are always created, to prevent them from becoming broken over time.
    // But they are visible only when running with &dev query parameter.
    const developerAccordionBox = new PickupCoilDeveloperAccordionBox( model, !!phet.chipper.queryParameters.dev );

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

    // To be set to correct bounds by Multilink below.
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

    const rootNode = new Node( {
      children: [
        pickupCoilNode.backgroundNode,
        this.fieldNode,
        pickupCoilAxisNode,
        barMagnetNode,
        pickupCoilNode,
        panels,
        this.compassNode,
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

    Multilink.multilink( [ isLockedToAxisProperty, panels.boundsProperty ],
      ( isLockedToAxis, panelsBounds ) => {
        if ( isLockedToAxis ) {

          // Move the pickup coil and magnet to a good position for horizontal dragging.
          const y = 400;
          model.pickupCoil.positionProperty.value = new Vector2( model.pickupCoil.positionProperty.value.x, y );
          model.barMagnet.positionProperty.value = new Vector2( model.barMagnet.positionProperty.value.x, y );

          // Change the cursors to indicate that drag direction is constrained to horizontal.
          barMagnetNode.cursor = 'ew-resize';
          pickupCoilNode.cursor = 'ew-resize';
          pickupCoilNode.backgroundNode.cursor = 'ew-resize';

          // Constrain to horizontal dragging for barMagnetNode and pickupCoilNode
          dragBoundsProperty.value = new Bounds2( this.layoutBounds.left, y, panelsBounds.left, y );
        }
        else {
          // Restore the cursors to indicate that drag direction is unconstrained.
          barMagnetNode.cursor = 'pointer';
          pickupCoilNode.cursor = 'pointer';
          pickupCoilNode.backgroundNode.cursor = 'pointer';

          // Restore drag bounds for barMagnetNode and pickupCoilNode.
          dragBoundsProperty.value = new Bounds2(
            this.layoutBounds.left,
            this.layoutBounds.top,
            panelsBounds.left,
            this.layoutBounds.bottom
          );
        }
      } );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilScreenView', PickupCoilScreenView );