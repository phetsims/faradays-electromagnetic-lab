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
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

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

    // Developer controls are always created, to prevent them from becoming broken over time.
    // But they are visible only when running with &dev query parameter.
    const developerAccordionBox = new BarMagnetDeveloperAccordionBox( model, !!phet.chipper.queryParameters.dev );

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

    const dragBoundsProperty = new DerivedProperty( [ panels.boundsProperty ],
      panelsBounds => new Bounds2(
        this.layoutBounds.left,
        this.layoutBounds.top,
        panelsBounds.left,
        this.layoutBounds.bottom
      ), {
        strictAxonDependencies: false //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/57
      } );

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

    const rootNode = new Node( {
      children: [
        this.fieldNode,
        barMagnetNode,
        earthNode,
        panels,
        this.compassNode,
        this.fieldMeterNode,
        this.resetAllButton,
        developerAccordionBox
      ]
    } );
    this.addChild( rootNode );

    rootNode.pdomOrder = [
      barMagnetNode,
      // Exclude earthNode from alt input because barMagnetNode is draggable with the keyboard, and earthNode follows it.
      this.compassNode,
      this.fieldMeterNode,
      panels,
      this.resetAllButton
      // Exclude developerAccordionBox from alt input because it is present it is not part of the production UI.
    ];
  }
}

faradaysElectromagneticLab.register( 'BarMagnetScreenView', BarMagnetScreenView );