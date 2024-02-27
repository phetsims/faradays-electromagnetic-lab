// Copyright 2023-2024, University of Colorado Boulder

/**
 * ToolsPanel is the panel that controls visibility of 'tools' - the compass and field meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import { combineOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../../common/FELConstants.js';
import Compass from '../model/Compass.js';
import FieldMeter from '../model/FieldMeter.js';
import Property from '../../../../axon/js/Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import LockToAxisCheckbox from './LockToAxisCheckbox.js';
import CompassCheckbox from './CompassCheckbox.js';
import FieldMeterCheckbox from './FieldMeterCheckbox.js';

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

    const checkboxes = [

      // 'Compass' checkbox
      new CompassCheckbox( compass.visibleProperty, options.tandem.createTandem( 'compassCheckbox' ) ),

      // 'Field Meter' checkbox
      new FieldMeterCheckbox( fieldMeter.visibleProperty, options.tandem.createTandem( 'fieldMeterCheckbox' ) )
    ];

    // 'Lock to Axis' checkbox
    if ( options.isLockedToAxisProperty ) {
      const lockToAxisCheckbox = new LockToAxisCheckbox( options.isLockedToAxisProperty, options.tandem.createTandem( 'lockToAxisCheckbox' ) );
      checkboxes.push( lockToAxisCheckbox );
    }

    const content = new VBox( combineOptions<VBoxOptions>( {}, FELConstants.VBOX_OPTIONS, {
      children: checkboxes,
      spacing: 7 // A bit less space because the checkbox icons are taller than the text.
    } ) );

    super( content, options );
  }
}

faradaysElectromagneticLab.register( 'ToolsPanel', ToolsPanel );