// Copyright 2023, University of Colorado Boulder

/**
 * ToolsPanel is the panel that controls visibility of 'tools' - the compass and field meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import { HBox, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import { combineOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../../common/FELConstants.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import Compass from '../model/Compass.js';
import FieldMeter from '../model/FieldMeter.js';
import Property from '../../../../axon/js/Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickupCoilAxisNode from './PickupCoilAxisNode.js';

type SelfOptions = {

  // Locks dragging to the pickup coil's horizontal axis.
  isLockedToAxisProperty?: Property<boolean> | null;
};

type ToolsPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

export default class ToolsPanel extends Panel {

  public constructor( compass: Compass, fieldMeter: FieldMeter, providedOptions: ToolsPanelOptions ) {

    const options = optionize4<ToolsPanelOptions, SelfOptions, PanelOptions>()( {}, FELConstants.PANEL_OPTIONS, {

      // SelfOptions
      isLockedToAxisProperty: null
    }, providedOptions );

    // 'Compass' checkbox
    const compassText = new Text( FaradaysElectromagneticLabStrings.compassStringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS );
    const compassCheckbox = new Checkbox( compass.visibleProperty, compassText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: options.tandem.createTandem( 'compassCheckbox' )
      } ) );

    // 'Field Meter' checkbox
    const fieldMeterText = new Text( FaradaysElectromagneticLabStrings.fieldMeterStringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS );
    const fieldMeterCheckbox = new Checkbox( fieldMeter.visibleProperty, fieldMeterText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: options.tandem.createTandem( 'fieldMeterCheckbox' )
      } ) );

    const children = [ compassCheckbox, fieldMeterCheckbox ];

    // 'Lock to Axis' checkbox
    if ( options.isLockedToAxisProperty ) {
      const content = new HBox( {
        spacing: 8,
        children: [
          new Text( 'Lock to Axis', FELConstants.CHECKBOX_TEXT_OPTIONS ),
          PickupCoilAxisNode.createIcon()
        ]
      } );
      const dragLockedCheckbox = new Checkbox( options.isLockedToAxisProperty, content,
        combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
          layoutOptions: {
            stretch: false
          },
          tandem: options.tandem.createTandem( 'dragLockedCheckbox' )
        } ) );
      children.push( dragLockedCheckbox );
    }

    const content = new VBox( combineOptions<VBoxOptions>( {}, FELConstants.VBOX_OPTIONS, {
      children: children
    } ) );

    super( content, options );
  }
}

faradaysElectromagneticLab.register( 'ToolsPanel', ToolsPanel );