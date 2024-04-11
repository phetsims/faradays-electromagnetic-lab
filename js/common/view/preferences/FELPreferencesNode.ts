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
import optionize from '../../../../../phet-core/js/optionize.js';
import CurrentTypePreferencesControl from './CurrentTypePreferencesControl.js';

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

    const currentTypePreferencesControl = new CurrentTypePreferencesControl( FELPreferences.currentTypeProperty,
      options.tandem.createTandem( 'currentTypePreferencesControl' ) );
    children.push( currentTypePreferencesControl );

    if ( options.hasEarthFeature ) {

      const addEarthCheckboxPreferencesControl = new AddEarthCheckboxPreferencesControl( FELPreferences.addEarthCheckboxProperty,
        options.tandem.createTandem( 'addEarthCheckboxPreferencesControl' ) );
      children.push( addEarthCheckboxPreferencesControl );

      const earthHemispherePreferencesControl = new EarthHemispherePreferencesControl( FELPreferences.earthHemisphereProperty,
        options.tandem.createTandem( 'earthImagePreferencesControl' ) );
      children.push( earthHemispherePreferencesControl );
    }

    options.children = children;

    super( options );
  }
}

faradaysElectromagneticLab.register( 'FELPreferencesNode', FELPreferencesNode );