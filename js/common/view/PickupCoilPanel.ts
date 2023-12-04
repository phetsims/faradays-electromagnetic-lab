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
import Property from '../../../../axon/js/Property.js';
import LoopRadiusControl from './LoopRadiusControl.js';
import NumberOfLoopsControl from './NumberOfLoopsControl.js';

export default class PickupCoilPanel extends Panel {

  public constructor( pickupCoil: PickupCoil, pickupCoilElectronsVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const titleText = new Text( FaradaysElectromagneticLabStrings.pickupCoilStringProperty, {
      font: FELConstants.TITLE_FONT
    } );

    const numberOfLoopsControl = new NumberOfLoopsControl( pickupCoil.numberOfLoopsProperty,
      tandem.createTandem( 'numberOfLoopsControl' ) );

    const loopAreaControl = new LoopRadiusControl( pickupCoil.loopRadiusProperty,
      tandem.createTandem( 'loopAreaControl' ) );

    // 'Electrons' checkbox
    const electronsText = new Text( FaradaysElectromagneticLabStrings.electronsStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );
    const electronsCheckbox = new Checkbox( pickupCoilElectronsVisibleProperty, electronsText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: tandem.createTandem( 'electronsCheckbox' )
      } ) );

    const contentChildren: Node[] = [
      titleText,
      //TODO indicatorRadioButtonGroup
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