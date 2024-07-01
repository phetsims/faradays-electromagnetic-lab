// Copyright 2023-2024, University of Colorado Boulder

/**
 * GeneratorScreenView is the top-level view for the 'Generator' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import GeneratorScreenModel from '../model/GeneratorScreenModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';
import GeneratorDeveloperAccordionBox from './GeneratorDeveloperAccordionBox.js';
import FELTimeControlNode from '../../common/view/FELTimeControlNode.js';
import GeneratorPanels from './GeneratorPanels.js';
import FELScreenView from '../../common/view/FELScreenView.js';
import GeneratorNode from './GeneratorNode.js';

export default class GeneratorScreenView extends FELScreenView {

  public constructor( model: GeneratorScreenModel, tandem: Tandem ) {

    const rightPanels = new GeneratorPanels( model, tandem.createTandem( 'rightPanels' ) );

    const timeControlNode = new FELTimeControlNode( model, tandem.createTandem( 'timeControlNode' ) );

    super( {
      magnet: model.generator.turbine.barMagnet,
      compass: model.compass,
      fieldMeter: model.fieldMeter,
      rightPanels: rightPanels,
      timeControlNode: timeControlNode,
      resetAll: () => model.reset(),
      tandem: tandem
    } );

    const generatorNode = new GeneratorNode( model.generator, this.layoutBounds,
      this.visibleBoundsProperty, tandem.createTandem( 'generatorNode' ) );

    // Rendering order, from back to front
    const screenViewRootNode = new Node( {
      children: [
        generatorNode.backgroundNode,
        this.fieldNode,
        this.compassNode, // behind generatorNode, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/10#issuecomment-1911160748
        generatorNode,
        rightPanels,
        this.fieldMeterNode,
        timeControlNode,
        this.resetAllButton
      ]
    } );
    this.addChild( screenViewRootNode );

    if ( phet.chipper.queryParameters.dev ) {
      this.addDeveloperAccordionBox( new GeneratorDeveloperAccordionBox( model.generator ) );
      this.addPickupCoilDebuggerPanel( model.generator.pickupCoil );
    }

    // Play Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomPlayAreaNode.pdomOrder = [
      generatorNode,
      this.compassNode,
      this.fieldMeterNode,
      rightPanels.barMagnetPanel,
      rightPanels.pickupCoilPanel
    ];

    // Control Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomControlAreaNode.pdomOrder = [
      rightPanels.toolsPanel,
      timeControlNode,
      this.resetAllButton
    ];
  }
}

faradaysElectromagneticLab.register( 'GeneratorScreenView', GeneratorScreenView );