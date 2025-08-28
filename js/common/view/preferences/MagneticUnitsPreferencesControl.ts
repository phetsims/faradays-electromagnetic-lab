// Copyright 2023-2025, University of Colorado Boulder

/**
 * MagneticUnitsPreferencesControl is the control in the Preferences dialog for choosing the magnetic units that
 * will be displayed by the field meter: G (gauss) or T (telsa).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUnionProperty from '../../../../../axon/js/StringUnionProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import PreferencesControl, { PreferencesControlOptions } from '../../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../../joist/js/preferences/PreferencesDialogConstants.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import RichText from '../../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabStrings from '../../../FaradaysElectromagneticLabStrings.js';
import FELConstants from '../../FELConstants.js';
import { MagneticUnits } from '../../FELQueryParameters.js';

export default class MagneticUnitsPreferencesControl extends PreferencesControl {

  public constructor( magneticUnitsProperty: StringUnionProperty<MagneticUnits>, tandem: Tandem ) {

    const labelText = new Text( FaradaysElectromagneticLabStrings.magneticUnitsStringProperty, {
      font: FELConstants.PREFERENCES_LABEL_FONT,
      maxWidth: FELConstants.PREFERENCES_LABEL_MAX_WIDTH
    } );

    const radioButtonGroup = new MagneticUnitsRadioButtonGroup( magneticUnitsProperty,
      tandem.createTandem( 'radioButtonGroup' ) );

    super( combineOptions<PreferencesControlOptions>( {}, FELConstants.PREFERENCES_CONTROL_OPTIONS, {
      labelNode: labelText,
      controlNode: radioButtonGroup,
      tandem: tandem
    } ) );
  }
}

/**
 * The radio button group for this control.
 */
class MagneticUnitsRadioButtonGroup extends AquaRadioButtonGroup<MagneticUnits> {

  public constructor( magneticUnitsProperty: StringUnionProperty<MagneticUnits>, tandem: Tandem ) {

    const items: AquaRadioButtonGroupItem<MagneticUnits>[] = [
      {
        value: 'G',
        createNode: radioButtonTandem => new MagneticUnitsRadioButtonText( FaradaysElectromagneticLabStrings.gaussPreferenceStringProperty, radioButtonTandem ),
        tandemName: 'gaussRadioButton'
      },
      {
        value: 'T',
        createNode: radioButtonTandem => new MagneticUnitsRadioButtonText( FaradaysElectromagneticLabStrings.teslaPreferenceStringProperty, radioButtonTandem ),
        tandemName: 'teslaRadioButton'
      }
    ];

    super( magneticUnitsProperty, items, {
      orientation: 'horizontal',
      spacing: 20,
      radioButtonOptions: {
        phetioVisiblePropertyInstrumented: false
      },
      phetioVisiblePropertyInstrumented: false,
      tandem: tandem
    } );
  }
}

/**
 * Label for a radio button.
 */
class MagneticUnitsRadioButtonText extends RichText {

  public constructor( stringProperty: TReadOnlyProperty<string>, radioButtonTandem: Tandem ) {
    super( stringProperty, {
      font: PreferencesDialogConstants.CONTENT_FONT,
      maxWidth: 100,
      tandem: radioButtonTandem.createTandem( 'text' )
    } );
  }
}

faradaysElectromagneticLab.register( 'MagneticUnitsPreferencesControl', MagneticUnitsPreferencesControl );