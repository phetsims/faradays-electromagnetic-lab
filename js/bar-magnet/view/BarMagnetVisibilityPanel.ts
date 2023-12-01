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
import FELPreferences from '../../common/model/FELPreferences.js';

export default class BarMagnetVisibilityPanel extends Panel {

  public constructor( fieldVisibleProperty: Property<boolean>,
                      compassVisibleProperty: Property<boolean>,
                      fieldMeterVisibleProperty: Property<boolean>,
                      earthVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    // 'Magnetic Field' checkbox
    const magneticFieldText = new Text( FaradaysElectromagneticLabStrings.magneticFieldStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );
    const magneticFieldCheckbox = new Checkbox( fieldVisibleProperty, magneticFieldText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: tandem.createTandem( 'magneticFieldCheckbox' )
      } ) );

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

    // 'Earth' checkbox
    const earthText = new Text( FaradaysElectromagneticLabStrings.earthStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );
    const earthCheckbox = new Checkbox( earthVisibleProperty, earthText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        visibleProperty: FELPreferences.addEarthCheckboxProperty,
        tandem: tandem.createTandem( 'earthCheckbox' )
      } ) );

    const content = new VBox( {
      align: 'left',
      spacing: 15,
      stretch: true,
      children: [
        magneticFieldCheckbox,
        fieldMeterCheckbox,
        compassCheckbox,
        earthCheckbox
      ]
    } );

    super( content, combineOptions<PanelOptions>( {}, FELConstants.PANEL_OPTIONS, {
      tandem: tandem
    } ) );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetVisibilityPanel', BarMagnetVisibilityPanel );