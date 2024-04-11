// Copyright 2023-2024, University of Colorado Boulder

/**
 * PickupCoilPanel is the panel that contains controls for changing Properties of the pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PickupCoil from '../model/PickupCoil.js';
import LoopAreaControl from './LoopAreaControl.js';
import NumberOfLoopsControl from './NumberOfLoopsControl.js';
import CurrentIndicatorControl from './CurrentIndicatorControl.js';
import CurrentCheckbox from './CurrentCheckbox.js';

export default class PickupCoilPanel extends Panel {

  public constructor( pickupCoil: PickupCoil, tandem: Tandem ) {

    const titleText = new Text( FaradaysElectromagneticLabStrings.pickupCoilStringProperty, FELConstants.PANEL_TITLE_OPTIONS );

    const currentIndicatorControl = new CurrentIndicatorControl( pickupCoil,
      tandem.createTandem( 'currentIndicatorControl' ) );

    const numberOfLoopsControl = new NumberOfLoopsControl( pickupCoil.coil.numberOfLoopsProperty,
      tandem.createTandem( 'numberOfLoopsControl' ) );

    const loopAreaControl = new LoopAreaControl( pickupCoil.coil.loopAreaPercentProperty,
      tandem.createTandem( 'loopAreaControl' ) );

    // 'Electrons' checkbox
    const electronsCheckbox = new CurrentCheckbox( pickupCoil.coil.electronsVisibleProperty,
      tandem.createTandem( 'electronsCheckbox' ) );

    const contentChildren: Node[] = [
      titleText,
      currentIndicatorControl,
      numberOfLoopsControl,
      loopAreaControl,
      electronsCheckbox
    ];

    const content = new VBox( combineOptions<VBoxOptions>( {}, FELConstants.VBOX_OPTIONS, {
      children: contentChildren
    } ) );

    super( content, combineOptions<PanelOptions>( {}, FELConstants.PANEL_OPTIONS, {
      tandem: tandem,
      phetioFeatured: true
    } ) );

    this.addLinkedElement( pickupCoil );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilPanel', PickupCoilPanel );