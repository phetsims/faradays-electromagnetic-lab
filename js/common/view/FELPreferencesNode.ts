// Copyright 2023, University of Colorado Boulder

/**
 * FELPreferencesNode is the user interface for sim-specific preferences, accessed via the
 * Simulation tab of the Preferences dialog. These preferences are global, and affect all screens.
 *
 * The Preferences dialog is created on demand by joist, using a PhetioCapsule. So this class must implement dispose,
 * and all children that have tandems or link to String Properties must be disposed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AddEarthCheckboxPreferencesControl from './AddEarthCheckboxPreferencesControl.js';
import FELPreferences from '../model/FELPreferences.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import MagneticUnitsPreferencesControl from './MagneticUnitsPreferencesControl.js';
import EarthImagePreferencesControl from './EarthImagePreferencesControl.js';

export default class FELPreferencesNode extends VBox {

  public constructor( tandem: Tandem ) {

    // Controls in the order that they appear in the Simulation tab, from top-to-bottom.
    const controls = [
      new MagneticUnitsPreferencesControl( FELPreferences.magneticUnitsProperty,
        tandem.createTandem( 'magneticUnitsPreferencesControl' ) ),
      new AddEarthCheckboxPreferencesControl( FELPreferences.addEarthCheckboxProperty,
        tandem.createTandem( 'addEarthCheckboxPreferencesControl' ) ),
      new EarthImagePreferencesControl( FELPreferences.earthImageProperty,
        tandem.createTandem( 'earthImagePreferencesControl' ) )
    ];

    super( {
      isDisposable: false,
      children: controls,
      align: 'left',
      spacing: 30,
      phetioVisiblePropertyInstrumented: false,
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'FELPreferencesNode', FELPreferencesNode );