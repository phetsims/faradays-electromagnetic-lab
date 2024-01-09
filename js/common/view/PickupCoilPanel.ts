// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoilPanel is the panel that contains controls for changing properties of the pickup coil.
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
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import LoopAreaControl from './LoopAreaControl.js';
import NumberOfLoopsControl from './NumberOfLoopsControl.js';
import CurrentIndicatorControl from './CurrentIndicatorControl.js';

export default class PickupCoilPanel extends Panel {

  public constructor( pickupCoil: PickupCoil, tandem: Tandem ) {

    const titleText = new Text( FaradaysElectromagneticLabStrings.pickupCoilStringProperty, FELConstants.PANEL_TITLE_OPTIONS );

    const currentIndicatorControl = new CurrentIndicatorControl( pickupCoil,
      tandem.createTandem( 'currentIndicatorControl' ) );

    const numberOfLoopsControl = new NumberOfLoopsControl( pickupCoil.numberOfLoopsProperty,
      tandem.createTandem( 'numberOfLoopsControl' ) );

    const loopAreaControl = new LoopAreaControl( pickupCoil.loopAreaProperty,
      tandem.createTandem( 'loopAreaControl' ) );

    // 'Electrons' checkbox
    const electronsText = new Text( FaradaysElectromagneticLabStrings.electronsStringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS );
    const electronsCheckbox = new Checkbox( pickupCoil.electronsVisibleProperty, electronsText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: tandem.createTandem( 'electronsCheckbox' )
      } ) );

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
      tandem: tandem
    } ) );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilPanel', PickupCoilPanel );