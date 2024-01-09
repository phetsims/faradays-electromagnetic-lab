// Copyright 2023, University of Colorado Boulder

/**
 * AddEarthCheckboxPreferencesControl is the control in the Preferences dialog for setting whether the 'Earth' checkbox
 * is available in screens where it is relevant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FELConstants from '../FELConstants.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import ToggleSwitch, { ToggleSwitchOptions } from '../../../../sun/js/ToggleSwitch.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { RichText, Text } from '../../../../scenery/js/imports.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';

export default class AddEarthCheckboxPreferencesControl extends PreferencesControl {

  private readonly disposeEarthPreferencesControl: () => void;

  public constructor( earthCheckboxVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const labelText = new Text( FaradaysElectromagneticLabStrings.earthPreferencesLabelStringProperty, {
      font: FELConstants.PREFERENCES_LABEL_FONT,
      maxWidth: FELConstants.PREFERENCES_LABEL_MAX_WIDTH,
      tandem: tandem.createTandem( 'labelText' )
    } );

    const toggleSwitch = new ToggleSwitch( earthCheckboxVisibleProperty, false, true,
      combineOptions<ToggleSwitchOptions>( {}, PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS, {
        tandem: tandem.createTandem( 'toggleSwitch' ),
        phetioVisiblePropertyInstrumented: false
      } ) );

    const descriptionText = new RichText( FaradaysElectromagneticLabStrings.earthPreferencesDescriptionStringProperty, {
      lineWrap: FELConstants.PREFERENCES_DESCRIPTION_LINE_WRAP,
      maxHeight: 50,
      font: FELConstants.PREFERENCES_DESCRIPTION_FONT,
      tandem: tandem.createTandem( 'descriptionText' )
    } );

    super( {
      labelNode: labelText,
      controlNode: toggleSwitch,
      descriptionNode: descriptionText,
      labelSpacing: 20,
      tandem: tandem,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    this.disposeEarthPreferencesControl = () => {
      labelText.dispose();
      toggleSwitch.dispose();
      descriptionText.dispose();
    };
  }

  public override dispose(): void {
    this.disposeEarthPreferencesControl();
    super.dispose();
  }
}

faradaysElectromagneticLab.register( 'AddEarthCheckboxPreferencesControl', AddEarthCheckboxPreferencesControl );