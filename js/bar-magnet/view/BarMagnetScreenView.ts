// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnetScreenView is the top-level view for the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnetScreenModel from '../model/BarMagnetScreenModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';
import BarMagnetViewProperties from './BarMagnetViewProperties.js';
import BarMagnetNode from '../../common/view/BarMagnetNode.js';
import EarthNode from '../../common/view/EarthNode.js';
import BarMagnetDeveloperAccordionBox from './BarMagnetDeveloperAccordionBox.js';
import BarMagnetPanels from './BarMagnetPanels.js';
import FELScreenView from '../../common/view/FELScreenView.js';
import FELQueryParameters from '../../common/FELQueryParameters.js';
import FieldPositionsNode from '../../common/view/FieldPositionsNode.js';
import FELPreferences from '../../common/model/FELPreferences.js';

export default class BarMagnetScreenView extends FELScreenView {

  public constructor( model: BarMagnetScreenModel, preferences: FELPreferences, tandem: Tandem ) {

    const viewProperties = new BarMagnetViewProperties( tandem.createTandem( 'viewProperties' ) );

    viewProperties.earthVisibleProperty.link( earthVisible => {
      if ( earthVisible ) {
        model.barMagnet.rotationProperty.value = Math.PI / 2; // north is down
      }
      else {
        model.barMagnet.rotationProperty.value = 0; // north is to the right
      }
    } );

    const panels = new BarMagnetPanels( model, viewProperties.seeInsideBarMagnetProperty,
      viewProperties.earthVisibleProperty, preferences.addEarthCheckboxProperty, tandem.createTandem( 'panels' ) );

    const developerAccordionBox = new BarMagnetDeveloperAccordionBox( model.barMagnet );

    super( {
      magnet: model.barMagnet,
      compass: model.compass,
      fieldMeter: model.fieldMeter,
      panels: panels,
      developerAccordionBox: developerAccordionBox,
      resetAll: () => {
        model.reset();
        viewProperties.reset();
      },
      tandem: tandem
    } );

    const dragBoundsProperty = this.createDragBoundsProperty( panels.boundsProperty );

    const barMagnetNode = new BarMagnetNode( model.barMagnet, {
      seeInsideProperty: viewProperties.seeInsideBarMagnetProperty,
      dragBoundsProperty: dragBoundsProperty,
      tandem: tandem.createTandem( 'barMagnetNode' )
    } );

    const earthNode = new EarthNode( model.barMagnet, preferences.earthHemisphereProperty, {
      dragBoundsProperty: dragBoundsProperty,
      visibleProperty: viewProperties.earthVisibleProperty,
      tandem: tandem.createTandem( 'earthNode' )
    } );

    // Rendering order, from back to front
    const screenViewRootNode = new Node( {
      children: [
        this.fieldNode,
        this.compassNode, // behind barMagnetNode, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/10#issuecomment-1911160748
        barMagnetNode,
        earthNode,
        panels,
        this.fieldMeterNode,
        this.resetAllButton,
        developerAccordionBox
      ]
    } );
    this.addChild( screenViewRootNode );

    // Debugging tool, to verify that FieldNode is rendering needles in the correct positions. This is sufficient
    // to check in one screen, since FieldNode is instantiated in the FELScreenView base class that is shared by
    // all screens.
    if ( FELQueryParameters.showFieldPositions ) {
      screenViewRootNode.addChild( new FieldPositionsNode( this.visibleBoundsProperty ) );
    }

    // Play Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomPlayAreaNode.pdomOrder = [
      barMagnetNode,
      // Exclude earthNode from alt input because barMagnetNode is draggable with the keyboard, and earthNode follows it.
      this.compassNode,
      this.fieldMeterNode,
      panels.barMagnetPanel
    ];

    // Control Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomControlAreaNode.pdomOrder = [
      panels.toolsPanel,
      this.resetAllButton
    ];
  }
}

faradaysElectromagneticLab.register( 'BarMagnetScreenView', BarMagnetScreenView );