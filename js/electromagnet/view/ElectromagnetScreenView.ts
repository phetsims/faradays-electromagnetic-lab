// Copyright 2023-2024, University of Colorado Boulder

/**
 * ElectromagnetScreenView is the top-level view for the 'Electromagnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import ElectromagnetModel from '../model/ElectromagnetModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';
import ElectromagnetDeveloperAccordionBox from './ElectromagnetDeveloperAccordionBox.js';
import FELTimeControlNode from '../../common/view/FELTimeControlNode.js';
import ElectromagnetNode from '../../common/view/ElectromagnetNode.js';
import ElectromagnetPanels from './ElectromagnetPanels.js';
import FELScreenView from '../../common/view/FELScreenView.js';

export default class ElectromagnetScreenView extends FELScreenView {

  public constructor( model: ElectromagnetModel, tandem: Tandem ) {

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

    const electromagnetNode = new ElectromagnetNode( model.electromagnet, model.stepEmitter, {
      dragBoundsProperty: dragBoundsProperty,
      tandem: tandem.createTandem( 'electromagnetNode' )
    } );

    const rootNode = new Node( {
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
    this.addChild( rootNode );

    rootNode.pdomOrder = [
      electromagnetNode,
      this.compassNode,
      this.fieldMeterNode,
      panels,
      timeControlNode,
      this.resetAllButton
      // Exclude developerAccordionBox from alt input because it is not part of the production UI.
    ];
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetScreenView', ElectromagnetScreenView );