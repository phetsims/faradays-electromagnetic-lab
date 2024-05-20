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
import PowerSupplyPanels from '../../common/view/PowerSupplyPanels.js';

export default class ElectromagnetScreenView extends FELScreenView {

  public constructor( model: ElectromagnetScreenModel, tandem: Tandem ) {

    const powerSupplyPanels = new PowerSupplyPanels( model.electromagnet.currentSourceProperty, model.electromagnet.dcPowerSupply,
      model.electromagnet.acPowerSupply, tandem.createTandem( 'powerSupplyPanels' ) );

    const rightPanels = new ElectromagnetPanels( model, tandem.createTandem( 'rightPanels' ) );

    const timeControlNode = new FELTimeControlNode( model, tandem.createTandem( 'timeControlNode' ) );

    const developerAccordionBox = new ElectromagnetDeveloperAccordionBox( model.electromagnet );

    super( {
      magnet: model.electromagnet,
      compass: model.compass,
      fieldMeter: model.fieldMeter,
      leftPanels: powerSupplyPanels,
      rightPanels: rightPanels,
      timeControlNode: timeControlNode,
      developerAccordionBox: developerAccordionBox,
      resetAll: () => model.reset(),
      tandem: tandem
    } );

    //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/163 How to prevent things from getting lost behind dcPowerSupplyPanel and acPowerSupplyPanel
    const dragBoundsProperty = this.createDragBoundsProperty( rightPanels.boundsProperty );

    const electromagnetNode = new ElectromagnetNode( model.electromagnet, {
      dragBoundsProperty: dragBoundsProperty,
      tandem: tandem.createTandem( 'electromagnetNode' )
    } );

    // Rendering order, from back to front
    const screenViewRootNode = new Node( {
      children: [
        electromagnetNode.backgroundNode,
        this.fieldNode,
        this.compassNode, // behind electromagnetNode, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/10#issuecomment-1911160748
        electromagnetNode,
        powerSupplyPanels,
        rightPanels,
        this.fieldMeterNode,
        timeControlNode,
        this.resetAllButton,
        developerAccordionBox
      ]
    } );
    this.addChild( screenViewRootNode );

    // Play Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomPlayAreaNode.pdomOrder = [
      electromagnetNode,
      powerSupplyPanels,
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