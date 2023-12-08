// Copyright 2023, University of Colorado Boulder

/**
 * ToolsPanel is the panel that controls visibility of 'tools' - the compass and field meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../../common/FELConstants.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import Compass from '../model/Compass.js';
import FieldMeter from '../model/FieldMeter.js';

export default class ToolsPanel extends Panel {

  public constructor( compass: Compass, fieldMeter: FieldMeter, tandem: Tandem ) {

    // 'Compass' checkbox
    const compassText = new Text( FaradaysElectromagneticLabStrings.compassStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );
    const compassCheckbox = new Checkbox( compass.visibleProperty, compassText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: tandem.createTandem( 'compassCheckbox' )
      } ) );

    // 'Field Meter' checkbox
    const fieldMeterText = new Text( FaradaysElectromagneticLabStrings.fieldMeterStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );
    const fieldMeterCheckbox = new Checkbox( fieldMeter.visibleProperty, fieldMeterText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: tandem.createTandem( 'fieldMeterCheckbox' )
      } ) );

    const content = new VBox( combineOptions<VBoxOptions>( {}, FELConstants.VBOX_OPTIONS, {
      children: [
        compassCheckbox,
        fieldMeterCheckbox
      ]
    } ) );

    super( content, combineOptions<PanelOptions>( {}, FELConstants.PANEL_OPTIONS, {
      tandem: tandem
    } ) );
  }
}

faradaysElectromagneticLab.register( 'ToolsPanel', ToolsPanel );