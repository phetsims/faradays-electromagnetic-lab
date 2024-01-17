// Copyright 2023-2024, University of Colorado Boulder

/**
 * GeneratorScreenView is the top-level view for the 'Generator' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import GeneratorModel from '../model/GeneratorModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';
import GeneratorDeveloperAccordionBox from './GeneratorDeveloperAccordionBox.js';
import PickupCoilDebuggerPanel from '../../common/view/PickupCoilDebuggerPanel.js';
import PickupCoilNode from '../../common/view/PickupCoilNode.js';
import TurbineNode from './TurbineNode.js';
import FELTimeControlNode from '../../common/view/FELTimeControlNode.js';
import GeneratorPanels from './GeneratorPanels.js';
import FELScreenView from '../../common/view/FELScreenView.js';

export default class GeneratorScreenView extends FELScreenView {

  public constructor( model: GeneratorModel, tandem: Tandem ) {

    const panels = new GeneratorPanels( model.turbine, model.pickupCoil, model.compass, model.fieldMeter,
      tandem.createTandem( 'panels' ) );

    const timeControlNode = new FELTimeControlNode( model, tandem.createTandem( 'timeControlNode' ) );

    // Developer controls are always created, to prevent them from becoming broken over time.
    // But they are visible only when running with &dev query parameter.
    const developerAccordionBox = new GeneratorDeveloperAccordionBox( model, !!phet.chipper.queryParameters.dev );

    super( {
      magnet: model.turbine,
      compass: model.compass,
      fieldMeter: model.fieldMeter,
      panels: panels,
      timeControlNode: timeControlNode,
      developerAccordionBox: developerAccordionBox,
      resetAll: () => model.reset(),
      tandem: tandem
    } );

    const turbineNode = new TurbineNode( model.turbine, this.layoutBounds, this.visibleBoundsProperty,
      tandem.createTandem( 'turbineNode' ) );

    const pickupCoilNode = new PickupCoilNode( model.pickupCoil, model.stepEmitter, {
      tandem: tandem.createTandem( 'pickupCoilNode' ),
      isMovable: false // pickupCoilNode is not movable in this screen.
    } );

    const pickupCoilDebuggerPanel = new PickupCoilDebuggerPanel( model.pickupCoil );
    pickupCoilDebuggerPanel.centerX = this.layoutBounds.centerX;
    pickupCoilDebuggerPanel.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;

    const rootNode = new Node( {
      children: [
        pickupCoilNode.backgroundNode,
        this.fieldNode,
        turbineNode,
        pickupCoilNode,
        panels,
        this.compassNode,
        this.fieldMeterNode,
        timeControlNode,
        this.resetAllButton,
        developerAccordionBox,
        pickupCoilDebuggerPanel
      ]
    } );
    this.addChild( rootNode );

    rootNode.pdomOrder = [
      turbineNode,
      this.compassNode,
      this.fieldMeterNode,
      panels,
      timeControlNode,
      this.resetAllButton
      // Exclude developerAccordionBox and pickupCoilDebuggerPanel from alt input.
    ];
  }
}

faradaysElectromagneticLab.register( 'GeneratorScreenView', GeneratorScreenView );