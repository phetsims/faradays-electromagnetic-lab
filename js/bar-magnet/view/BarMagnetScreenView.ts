// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetScreenView is the top-level view for the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnetModel from '../model/BarMagnetModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';
import BarMagnetViewProperties from './BarMagnetViewProperties.js';
import Multilink from '../../../../axon/js/Multilink.js';
import BarMagnetNode from '../../common/view/BarMagnetNode.js';
import EarthNode from '../../common/view/EarthNode.js';
import FieldNode from '../../common/view/FieldNode.js';
import FieldMeterNode from '../../common/view/FieldMeterNode.js';
import CompassNode from '../../common/view/CompassNode.js';
import BarMagnetDeveloperAccordionBox from './BarMagnetDeveloperAccordionBox.js';
import BarMagnetPanels from './BarMagnetPanels.js';

export default class BarMagnetScreenView extends ScreenView {

  public constructor( model: BarMagnetModel, tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem
    } );

    const viewProperties = new BarMagnetViewProperties( tandem.createTandem( 'viewProperties' ) );

    viewProperties.earthVisibleProperty.link( earthVisible => {
      if ( earthVisible ) {
        model.barMagnet.rotationProperty.value = -Math.PI / 2; // north is up
      }
      else {
        model.barMagnet.rotationProperty.value = 0; // north is to the right
      }
    } );

    const fieldNode = new FieldNode( model.barMagnet, {
      visibleBoundsProperty: this.visibleBoundsProperty,
      tandem: tandem.createTandem( 'fieldNode' )
    } );

    const barMagnetNode = new BarMagnetNode( model.barMagnet, {
      seeInsideProperty: viewProperties.seeInsideBarMagnetProperty,
      tandem: tandem.createTandem( 'barMagnetNode' )
    } );

    const fieldMeterNode = new FieldMeterNode( model.fieldMeter, tandem.createTandem( 'fieldMeterNode' ) );

    const compassNode = new CompassNode( model.compass, tandem.createTandem( 'compassNode' ) );

    const earthNode = new EarthNode( model.barMagnet, {
      visibleProperty: viewProperties.earthVisibleProperty,
      tandem: tandem.createTandem( 'earthNode' )
    } );

    const panels = new BarMagnetPanels( model.barMagnet, model.compass, model.fieldMeter, viewProperties, tandem.createTandem( 'panels' ) );

    // Adjust position of the control panels
    Multilink.multilink( [ this.visibleBoundsProperty, panels.boundsProperty ],
      ( visibleBounds, panelsBounds ) => {
        panels.right = visibleBounds.right - FELConstants.SCREEN_VIEW_X_MARGIN;
        panels.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        viewProperties.reset();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.visibleBoundsProperty.link( visibleBounds => {
      resetAllButton.right = visibleBounds.maxX - FELConstants.SCREEN_VIEW_X_MARGIN;
      resetAllButton.bottom = visibleBounds.maxY - FELConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    // Developer controls are always created, to prevent them from becoming broken over time.
    // But they are visible only when running with &dev query parameter.
    const developerAccordionBox = new BarMagnetDeveloperAccordionBox( model, !!phet.chipper.queryParameters.dev );
    Multilink.multilink( [ developerAccordionBox.boundsProperty, this.visibleBoundsProperty ],
      ( bounds, visibleBounds ) => {
        developerAccordionBox.left = visibleBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN;
        developerAccordionBox.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );

    const rootNode = new Node( {
      children: [
        fieldNode,
        barMagnetNode,
        earthNode,
        compassNode,
        fieldMeterNode,
        panels,
        resetAllButton,
        developerAccordionBox
      ]
    } );
    this.addChild( rootNode );

    rootNode.pdomOrder = [
      barMagnetNode,
      compassNode,
      fieldMeterNode,
      panels,
      resetAllButton
      // Exclude developerAccordionBox from alt input.
    ];
  }
}

faradaysElectromagneticLab.register( 'BarMagnetScreenView', BarMagnetScreenView );