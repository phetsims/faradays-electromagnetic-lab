// Copyright 2023-2024, University of Colorado Boulder

/**
 * ElectromagnetScreenView is the top-level view for the 'Electromagnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import ElectromagnetScreenModel from '../model/ElectromagnetScreenModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';
import ElectromagnetDeveloperAccordionBox from './ElectromagnetDeveloperAccordionBox.js';
import FELTimeControlNode from '../../common/view/FELTimeControlNode.js';
import ElectromagnetPanels from './ElectromagnetPanels.js';
import FELScreenView from '../../common/view/FELScreenView.js';
import ElectromagnetNode from '../../common/view/ElectromagnetNode.js';
import FELConstants from '../../common/FELConstants.js';
import DCPowerSupplyPanel from '../../common/view/DCPowerSupplyPanel.js';
import ACPowerSupplyPanel from '../../common/view/ACPowerSupplyPanel.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class ElectromagnetScreenView extends FELScreenView {

  public constructor( model: ElectromagnetScreenModel, tandem: Tandem ) {

    // To improve readability
    const electromagnet = model.electromagnet;

    const rightPanels = new ElectromagnetPanels( model, tandem.createTandem( 'rightPanels' ) );

    const timeControlNode = new FELTimeControlNode( model, tandem.createTandem( 'timeControlNode' ) );

    super( {
      magnet: electromagnet,
      compass: model.compass,
      fieldMeter: model.fieldMeter,
      rightPanels: rightPanels,
      timeControlNode: timeControlNode,
      resetAll: () => {
        model.reset();
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

    const electromagnetNode = new ElectromagnetNode( electromagnet, {
      dragBoundsProperty: FELScreenView.createDragBoundsProperty( rightPanels.boundsProperty, this.layoutBounds ),
      tandem: tandem.createTandem( 'electromagnetNode' )
    } );

    // Rendering order, from back to front
    const screenViewRootNode = new Node( {
      children: [
        electromagnetNode.backgroundNode,
        this.fieldNode,
        this.compassNode, // behind electromagnetNode, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/10#issuecomment-1911160748
        electromagnetNode,
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
      this.addDeveloperAccordionBox( new ElectromagnetDeveloperAccordionBox( electromagnet ) );
    }

    // Play Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomPlayAreaNode.pdomOrder = [
      electromagnetNode,
      dcPowerSupplyPanel,
      acPowerSupplyPanel,
      this.compassNode,
      this.fieldMeterNode,
      rightPanels.electromagnetPanel
    ];

    // Control Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomControlAreaNode.pdomOrder = [
      rightPanels.toolsPanel,
      timeControlNode,
      this.resetAllButton
    ];
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetScreenView', ElectromagnetScreenView );