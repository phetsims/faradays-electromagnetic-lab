// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELPreferencesNode is the user interface for sim-specific preferences, accessed via the
 * Simulation tab of the Preferences dialog. These preferences are global, and affect all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { VBox, VBoxOptions } from '../../../../../scenery/js/imports.js';
import AddEarthCheckboxPreferencesControl from './AddEarthCheckboxPreferencesControl.js';
import FELPreferences from '../../model/FELPreferences.js';
import faradaysElectromagneticLab from '../../../faradaysElectromagneticLab.js';
import MagneticUnitsPreferencesControl from './MagneticUnitsPreferencesControl.js';
import EarthHemispherePreferencesControl from './EarthHemispherePreferencesControl.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import CurrentFlowPreferencesControl from './CurrentFlowPreferencesControl.js';
import Tandem from '../../../../../tandem/js/Tandem.js';

type SelfOptions = {

  // Whether the sim has the feature for changing the convention for current flow.
  hasCurrentFlowFeature?: boolean;

  // Whether the sim has the feature that shows the alignment of a bar magnet with planet Earth.
  hasEarthFeature?: boolean;
};

export type FELPreferencesNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class FELPreferencesNode extends VBox {

  public constructor( preferences: FELPreferences, tandem: Tandem ) {

    // Controls in the order that they appear in the Simulation tab, from top-to-bottom.
    const controls = [];

    const magneticUnitsPreferencesControl = new MagneticUnitsPreferencesControl( preferences.magneticUnitsProperty,
      tandem.createTandem( 'magneticUnitsPreferencesControl' ) );
    controls.push( magneticUnitsPreferencesControl );

    if ( preferences.hasCurrentFlowFeature ) {
      const currentFlowPreferencesControl = new CurrentFlowPreferencesControl( preferences.currentFlowProperty,
        tandem.createTandem( 'currentFlowPreferencesControl' ) );
      controls.push( currentFlowPreferencesControl );
    }

    if ( preferences.hasEarthFeature ) {

      const addEarthCheckboxPreferencesControl = new AddEarthCheckboxPreferencesControl( preferences.addEarthCheckboxProperty,
        tandem.createTandem( 'addEarthCheckboxPreferencesControl' ) );
      controls.push( addEarthCheckboxPreferencesControl );

      const earthHemispherePreferencesControl = new EarthHemispherePreferencesControl( preferences.earthHemisphereProperty,
        preferences.addEarthCheckboxProperty, tandem.createTandem( 'earthImagePreferencesControl' ) );
      controls.push( earthHemispherePreferencesControl );
    }

    super( {
      children: controls,
      isDisposable: false,
      align: 'left',
      spacing: 30,
      phetioVisiblePropertyInstrumented: false
    } );
  }
}

faradaysElectromagneticLab.register( 'FELPreferencesNode', FELPreferencesNode );