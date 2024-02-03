// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnetScreenView is the top-level view for the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnetModel from '../model/BarMagnetModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';
import BarMagnetViewProperties from './BarMagnetViewProperties.js';
import BarMagnetNode from '../../common/view/BarMagnetNode.js';
import EarthNode from '../../common/view/EarthNode.js';
import BarMagnetDeveloperAccordionBox from './BarMagnetDeveloperAccordionBox.js';
import BarMagnetPanels from './BarMagnetPanels.js';
import FELScreenView from '../../common/view/FELScreenView.js';

export default class BarMagnetScreenView extends FELScreenView {

  public constructor( model: BarMagnetModel, tandem: Tandem ) {

    const viewProperties = new BarMagnetViewProperties( tandem.createTandem( 'viewProperties' ) );

    viewProperties.earthVisibleProperty.link( earthVisible => {
      if ( earthVisible ) {
        model.barMagnet.rotationProperty.value = -Math.PI / 2; // north is up
      }
      else {
        model.barMagnet.rotationProperty.value = 0; // north is to the right
      }
    } );

    const panels = new BarMagnetPanels( model.barMagnet, model.compass, model.fieldMeter, viewProperties, tandem.createTandem( 'panels' ) );

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

    const earthNode = new EarthNode( model.barMagnet, {
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

    // The order of focusable elements in the DOM
    screenViewRootNode.pdomOrder = [
      barMagnetNode,
      // Exclude earthNode from alt input because barMagnetNode is draggable with the keyboard, and earthNode follows it.
      this.compassNode,
      this.fieldMeterNode,
      panels,
      this.resetAllButton
      // Exclude developerAccordionBox because it is not part of the production UI.
    ];
  }
}

faradaysElectromagneticLab.register( 'BarMagnetScreenView', BarMagnetScreenView );