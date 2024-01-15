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

    // Developer controls are always created, to prevent them from becoming broken over time.
    // But they are visible only when running with &dev query parameter.
    const developerAccordionBox = new ElectromagnetDeveloperAccordionBox( model, !!phet.chipper.queryParameters.dev );

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

    const electromagnetNode = new ElectromagnetNode( model.electromagnet, model.stepEmitter,
      tandem.createTandem( 'electromagnetNode' ) );

    const rootNode = new Node( {
      children: [
        electromagnetNode.backgroundNode,
        this.fieldNode,
        electromagnetNode,
        this.compassNode,
        this.fieldMeterNode,
        panels,
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
      // Exclude developerAccordionBox from alt input.
    ];
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetScreenView', ElectromagnetScreenView );