// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetVisibilityPanel is the panel that controls visibility of various things on the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Property from '../../../../axon/js/Property.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../../common/FELConstants.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';

export default class BarMagnetVisibilityPanel extends Panel {

  public constructor( fieldVisibleProperty: Property<boolean>,
                      compassVisibleProperty: Property<boolean>,
                      fieldMeterVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    // 'Show Field' checkbox
    const showFieldText = new Text( FaradaysElectromagneticLabStrings.showFieldStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );
    const showFieldCheckbox = new Checkbox( fieldVisibleProperty, showFieldText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: tandem.createTandem( 'showFieldCheckbox' )
      } ) );

    // 'Show Compass' checkbox
    const showCompassText = new Text( FaradaysElectromagneticLabStrings.showCompassStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );
    const showCompassCheckbox = new Checkbox( compassVisibleProperty, showCompassText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: tandem.createTandem( 'showCompassCheckbox' )
      } ) );

    // 'Show Field Meter' checkbox
    const showFieldMeterText = new Text( FaradaysElectromagneticLabStrings.showFieldMeterStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );
    const showFieldMeterCheckbox = new Checkbox( fieldMeterVisibleProperty, showFieldMeterText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: tandem.createTandem( 'showFieldMeterCheckbox' )
      } ) );

    const content = new VBox( {
      align: 'left',
      spacing: 15,
      stretch: true,
      children: [
        showFieldCheckbox,
        showCompassCheckbox,
        showFieldMeterCheckbox
      ]
    } );

    super( content, combineOptions<PanelOptions>( {}, FELConstants.PANEL_OPTIONS, {
      tandem: tandem
    } ) );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetVisibilityPanel', BarMagnetVisibilityPanel );