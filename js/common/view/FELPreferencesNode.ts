// Copyright 2023, University of Colorado Boulder

/**
 * FELPreferencesNode is the user interface for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * The Preferences dialog is created on demand by joist, using a PhetioCapsule. So FELPreferencesNode and its
 * subcomponents must implement dispose.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Text, VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

export default class FELPreferencesNode extends VBox {

  public constructor( tandem: Tandem ) {

    //TODO delete this, add UI components for FELPreferences
    const underConstructionText = new Text( 'Under Construction', {
      font: new PhetFont( 22 ),
      fill: 'red'
    } );

    super( {

      // VBoxOptions
      children: [ underConstructionText ],
      align: 'left',
      spacing: 20,
      phetioVisiblePropertyInstrumented: false,
      tandem: tandem
    } );
  }

}

faradaysElectromagneticLab.register( 'FELPreferencesNode', FELPreferencesNode );