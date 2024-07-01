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

    // To improve readability
    const barMagnet = model.barMagnet;
    const pickupCoil = model.pickupCoil;

    const lockToAxisProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'lockToAxisProperty' ),
      phetioDocumentation: 'When true, dragging the magnet or pickup coil is locked to the pickup coil\'s horizontal axis.'
    } );
    lockToAxisProperty.link( lockToAxis =>
      FELScreenView.lockToAxisListener( lockToAxis, barMagnet.positionProperty, pickupCoil.positionProperty ) );

    const rightPanels = new PickupCoilPanels( model, lockToAxisProperty, tandem.createTandem( 'rightPanels' ) );

    const developerAccordionBox = new PickupCoilDeveloperAccordionBox( barMagnet, pickupCoil );

    super( {
      magnet: barMagnet,
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
      this.layoutBounds, rightPanels.boundsProperty, pickupCoil.positionProperty );

    const barMagnetNode = new BarMagnetNode( barMagnet, {
      dragBoundsProperty: dragBoundsProperty,
      lockToAxisProperty: lockToAxisProperty,
      tandem: tandem.createTandem( 'barMagnetNode' )
    } );

    const pickupCoilNode = new PickupCoilNode( pickupCoil, {
      dragBoundsProperty: dragBoundsProperty,
      lockToAxisProperty: lockToAxisProperty,
      tandem: tandem.createTandem( 'pickupCoilNode' )
    } );

    const pickupCoilAxisNode = new PickupCoilAxisNode( lockToAxisProperty, pickupCoil.positionProperty,
      this.visibleBoundsProperty );

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
        developerAccordionBox
      ]
    } );
    this.addChild( screenViewRootNode );

    if ( phet.chipper.queryParameters.dev ) {
      const pickupCoilDebuggerPanel = new PickupCoilDebuggerPanel( pickupCoil, {
        left: this.layoutBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.bottom - FELConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( pickupCoilDebuggerPanel );
    }

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