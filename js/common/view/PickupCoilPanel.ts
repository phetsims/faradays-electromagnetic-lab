// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoilPanel is the panel that contains controls for changing properties of the pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { Node, Text, VBox } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PickupCoil from '../model/PickupCoil.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Property from '../../../../axon/js/Property.js';
import LoopRadiusControl from './LoopRadiusControl.js';

export default class PickupCoilPanel extends Panel {

  public constructor( pickupCoil: PickupCoil, pickupCoilElectronsVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const titleText = new Text( FaradaysElectromagneticLabStrings.pickupCoilStringProperty, {
      font: FELConstants.TITLE_FONT
    } );

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
      //TODO loopsSpinner
      loopAreaControl,
      electronsCheckbox
    ];

    const content = new VBox( {
      align: 'left',
      spacing: 15,
      stretch: true,
      children: contentChildren
    } );

    super( content, combineOptions<PanelOptions>( {}, FELConstants.PANEL_OPTIONS, {
      tandem: tandem
    } ) );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilPanel', PickupCoilPanel );