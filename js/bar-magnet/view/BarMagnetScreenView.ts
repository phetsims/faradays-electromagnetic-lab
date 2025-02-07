// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnetScreenView is the top-level view for the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FELQueryParameters from '../../common/FELQueryParameters.js';
import FELPreferences from '../../common/model/FELPreferences.js';
import BarMagnetNode from '../../common/view/BarMagnetNode.js';
import EarthNode from '../../common/view/EarthNode.js';
import FELScreenView from '../../common/view/FELScreenView.js';
import FieldPositionsNode from '../../common/view/FieldPositionsNode.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnetScreenModel from '../model/BarMagnetScreenModel.js';
import BarMagnetDeveloperAccordionBox from './BarMagnetDeveloperAccordionBox.js';
import BarMagnetPanels from './BarMagnetPanels.js';
import BarMagnetViewProperties from './BarMagnetViewProperties.js';

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

    const rightPanels = new BarMagnetPanels( model, viewProperties.seeInsideBarMagnetProperty,
      viewProperties.earthVisibleProperty, preferences.addEarthCheckboxProperty, tandem.createTandem( 'rightPanels' ) );

    super( {
      magnet: model.barMagnet,
      compass: model.compass,
      fieldMeter: model.fieldMeter,
      rightPanels: rightPanels,
      resetAll: () => {
        model.reset();
        viewProperties.reset();
      },
      tandem: tandem
    } );

    const dragBoundsProperty = FELScreenView.createDragBoundsProperty( rightPanels.boundsProperty, this.layoutBounds );

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

    // If interactivity for earthNode is disabled, also disable pickable, so that things that are behind earthNode
    // (like the compass) can be grabbed. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/198.
    earthNode.inputEnabledProperty.link( inputEnabled => {
      earthNode.pickable = inputEnabled;
    } );

    // Rendering order, from back to front
    const screenViewRootNode = new Node( {
      children: [
        this.fieldNode,
        this.compassNode, // behind barMagnetNode, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/10#issuecomment-1911160748
        barMagnetNode,
        earthNode,
        rightPanels,
        this.fieldMeterNode,
        this.resetAllButton
      ]
    } );
    this.addChild( screenViewRootNode );

    if ( phet.chipper.queryParameters.dev ) {
      this.addDeveloperAccordionBox( new BarMagnetDeveloperAccordionBox( model.barMagnet ) );
    }

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
      rightPanels.barMagnetPanel
    ];

    // Control Area focus order, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/81
    this.pdomControlAreaNode.pdomOrder = [
      rightPanels.toolsPanel,
      this.resetAllButton
    ];
  }
}

faradaysElectromagneticLab.register( 'BarMagnetScreenView', BarMagnetScreenView );