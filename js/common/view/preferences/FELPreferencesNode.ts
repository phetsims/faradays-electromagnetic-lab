// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELPreferencesNode is the user interface for sim-specific preferences, accessed via the
 * Simulation tab of the Preferences dialog. These preferences are global, and affect all screens.
 *
 * The Preferences dialog is created on demand by joist, using a PhetioCapsule. So this class must implement dispose,
 * and all children that have tandems or link to String Properties must be disposed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { VBox, VBoxOptions } from '../../../../../scenery/js/imports.js';
import AddEarthCheckboxPreferencesControl from './AddEarthCheckboxPreferencesControl.js';
import FELPreferences from '../../model/FELPreferences.js';
import faradaysElectromagneticLab from '../../../faradaysElectromagneticLab.js';
import MagneticUnitsPreferencesControl from './MagneticUnitsPreferencesControl.js';
import EarthImagePreferencesControl from './EarthImagePreferencesControl.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../../phet-core/js/optionize.js';

type SelfOptions = {

  // Whether the sim has the feature that shows the alignment of a bar magnet with planet Earth.
  hasEarthFeature?: boolean;
};

type FELPreferencesNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class FELPreferencesNode extends VBox {

  public constructor( providedOptions: FELPreferencesNodeOptions ) {

    const options = optionize<FELPreferencesNodeOptions, SelfOptions, VBoxOptions>()( {

      // SelfOptions
      hasEarthFeature: true,

      // VBoxOptions
      isDisposable: false,
      align: 'left',
      spacing: 30,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    // Controls in the order that they appear in the Simulation tab, from top-to-bottom.
    const children = [];

    const magneticUnitsPreferencesControl = new MagneticUnitsPreferencesControl( FELPreferences.magneticUnitsProperty,
      options.tandem.createTandem( 'magneticUnitsPreferencesControl' ) );
    children.push( magneticUnitsPreferencesControl );

    if ( options.hasEarthFeature ) {

      const addEarthCheckboxPreferencesControl = new AddEarthCheckboxPreferencesControl( FELPreferences.addEarthCheckboxProperty,
        options.tandem.createTandem( 'addEarthCheckboxPreferencesControl' ) );
      children.push( addEarthCheckboxPreferencesControl );

      const earthImagePreferencesControl = new EarthImagePreferencesControl( FELPreferences.earthImageProperty,
        options.tandem.createTandem( 'earthImagePreferencesControl' ) );
      children.push( earthImagePreferencesControl );
    }

    options.children = children;

    super( options );
  }
}

faradaysElectromagneticLab.register( 'FELPreferencesNode', FELPreferencesNode );