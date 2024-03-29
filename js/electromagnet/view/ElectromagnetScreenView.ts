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
import ElectromagnetNode from '../../common/view/ElectromagnetNode.js';
import ElectromagnetPanels from './ElectromagnetPanels.js';
import FELScreenView from '../../common/view/FELScreenView.js';

export default class ElectromagnetScreenView extends FELScreenView {

  public constructor( model: ElectromagnetScreenModel, tandem: Tandem ) {

    const panels = new ElectromagnetPanels( model.electromagnet, model.compass, model.fieldMeter, tandem.createTandem( 'panels' ) );

    const timeControlNode = new FELTimeControlNode( model, tandem.createTandem( 'timeControlNode' ) );

    const developerAccordionBox = new ElectromagnetDeveloperAccordionBox( model.electromagnet );

    super( {
      magnet: model.electromagnet,
      compass: model.compass,
      fieldMeter: model.fieldMeter,
      panels: panels,
      timeControlNode: timeControlNode,
      developerAccordionBox: developerAccordionBox,
      resetAll: () => model.reset(),
      tandem: tandem
    } );

    const dragBoundsProperty = this.createDragBoundsProperty( panels.boundsProperty );

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
        panels,
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
      this.compassNode,
      this.fieldMeterNode,
      panels.electromagnetPanel
    ];

    // Control Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomControlAreaNode.pdomOrder = [
      panels.toolsPanel,
      timeControlNode,
      this.resetAllButton
    ];
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetScreenView', ElectromagnetScreenView );