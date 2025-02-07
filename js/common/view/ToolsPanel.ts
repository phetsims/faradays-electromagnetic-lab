// Copyright 2023-2024, University of Colorado Boulder

/**
 * ToolsPanel is the panel that controls visibility of 'tools': the compass, field meter, and 'Lock to Axis' feature.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Compass from '../model/Compass.js';
import FieldMeter from '../model/FieldMeter.js';
import CompassCheckbox from './CompassCheckbox.js';
import FieldMeterCheckbox from './FieldMeterCheckbox.js';
import LockToAxisCheckbox from './LockToAxisCheckbox.js';

type SelfOptions = {

  // Locks dragging to the pickup coil's horizontal axis.
  lockToAxisProperty?: Property<boolean> | null;
};

type ToolsPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

export default class ToolsPanel extends Panel {

  public constructor( compass: Compass, fieldMeter: FieldMeter, providedOptions: ToolsPanelOptions ) {

    const options = optionize4<ToolsPanelOptions, SelfOptions, PanelOptions>()( {}, FELConstants.PANEL_OPTIONS, {

      // SelfOptions
      lockToAxisProperty: null
    }, providedOptions );

    const checkboxes = [

      // 'Compass' checkbox
      new CompassCheckbox( compass.visibleProperty, options.tandem.createTandem( 'compassCheckbox' ) ),

      // 'Field Meter' checkbox
      new FieldMeterCheckbox( fieldMeter.visibleProperty, options.tandem.createTandem( 'fieldMeterCheckbox' ) )
    ];

    // 'Lock to Axis' checkbox
    if ( options.lockToAxisProperty ) {
      const lockToAxisCheckbox = new LockToAxisCheckbox( options.lockToAxisProperty, options.tandem.createTandem( 'lockToAxisCheckbox' ) );
      checkboxes.push( lockToAxisCheckbox );
    }

    const content = new VBox( combineOptions<VBoxOptions>( {}, FELConstants.VBOX_OPTIONS, {
      children: checkboxes
    } ) );

    super( content, options );
  }
}

faradaysElectromagneticLab.register( 'ToolsPanel', ToolsPanel );