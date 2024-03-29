// Copyright 2023-2024, University of Colorado Boulder

/**
 * GeneratorScreenView is the top-level view for the 'Generator' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import GeneratorScreenModel from '../model/GeneratorScreenModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';
import GeneratorDeveloperAccordionBox from './GeneratorDeveloperAccordionBox.js';
import PickupCoilDebuggerPanel from '../../common/view/PickupCoilDebuggerPanel.js';
import FELTimeControlNode from '../../common/view/FELTimeControlNode.js';
import GeneratorPanels from './GeneratorPanels.js';
import FELScreenView from '../../common/view/FELScreenView.js';
import GeneratorNode from './GeneratorNode.js';

export default class GeneratorScreenView extends FELScreenView {

  public constructor( model: GeneratorScreenModel, tandem: Tandem ) {

    const panels = new GeneratorPanels( model.generator, model.compass, model.fieldMeter,
      tandem.createTandem( 'panels' ) );

    const timeControlNode = new FELTimeControlNode( model, tandem.createTandem( 'timeControlNode' ) );

    const developerAccordionBox = new GeneratorDeveloperAccordionBox( model.generator );

    super( {
      magnet: model.generator.turbine.barMagnet,
      compass: model.compass,
      fieldMeter: model.fieldMeter,
      panels: panels,
      timeControlNode: timeControlNode,
      developerAccordionBox: developerAccordionBox,
      resetAll: () => model.reset(),
      tandem: tandem
    } );

    const generatorNode = new GeneratorNode( model.generator, this.layoutBounds,
      this.visibleBoundsProperty, tandem.createTandem( 'generatorNode' ) );

    const pickupCoilDebuggerPanel = new PickupCoilDebuggerPanel( model.generator.pickupCoil );
    pickupCoilDebuggerPanel.centerX = this.layoutBounds.centerX;
    pickupCoilDebuggerPanel.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;

    // Rendering order, from back to front
    const screenViewRootNode = new Node( {
      children: [
        generatorNode.backgroundNode,
        this.fieldNode,
        this.compassNode, // behind generatorNode, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/10#issuecomment-1911160748
        generatorNode,
        panels,
        this.fieldMeterNode,
        timeControlNode,
        this.resetAllButton,
        developerAccordionBox,
        pickupCoilDebuggerPanel
      ]
    } );
    this.addChild( screenViewRootNode );

    // Play Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomPlayAreaNode.pdomOrder = [
      generatorNode,
      this.compassNode,
      this.fieldMeterNode,
      panels.barMagnetPanel,
      panels.pickupCoilPanel
    ];

    // Control Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomControlAreaNode.pdomOrder = [
      panels.toolsPanel,
      timeControlNode,
      this.resetAllButton
    ];
  }
}

faradaysElectromagneticLab.register( 'GeneratorScreenView', GeneratorScreenView );