// Copyright 2023, University of Colorado Boulder

//TODO identical to PickupCoilVisibilityPanel
/**
 * ElectromagnetVisibilityPanel is the panel that controls visibility of various things on the 'Electromagnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Property from '../../../../axon/js/Property.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../../common/FELConstants.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';

export default class ElectromagnetVisibilityPanel extends Panel {

  public constructor( compassVisibleProperty: Property<boolean>,
                      fieldMeterVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    // 'Field Meter' checkbox
    const fieldMeterText = new Text( FaradaysElectromagneticLabStrings.fieldMeterStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );
    const fieldMeterCheckbox = new Checkbox( fieldMeterVisibleProperty, fieldMeterText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: tandem.createTandem( 'fieldMeterCheckbox' )
      } ) );

    // 'Compass' checkbox
    const compassText = new Text( FaradaysElectromagneticLabStrings.compassStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );
    const compassCheckbox = new Checkbox( compassVisibleProperty, compassText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: tandem.createTandem( 'compassCheckbox' )
      } ) );

    const content = new VBox( combineOptions<VBoxOptions>( {}, FELConstants.VBOX_OPTIONS, {
      children: [
        fieldMeterCheckbox,
        compassCheckbox
      ]
    } ) );

    super( content, combineOptions<PanelOptions>( {}, FELConstants.PANEL_OPTIONS, {
      tandem: tandem
    } ) );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetVisibilityPanel', ElectromagnetVisibilityPanel );