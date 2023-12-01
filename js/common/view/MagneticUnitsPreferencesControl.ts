// Copyright 2022-2023, University of Colorado Boulder

/**
 * MagneticUnitsPreferencesControl is the control in the Preferences dialog for choosing which magnetic units will
 * be displayed in the sim. The user has a choice between G (gauss) and T (telsa).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { RichText, Text } from '../../../../scenery/js/imports.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import { MagneticUnits } from '../FELQueryParameters.js';
import FELConstants from '../FELConstants.js';

export default class MagneticUnitsPreferencesControl extends PreferencesControl {

  private readonly disposeMagneticUnitsPreferencesControl: () => void;

  public constructor( magneticUnitsProperty: StringUnionProperty<MagneticUnits>, tandem: Tandem ) {

    const labelText = new Text( FaradaysElectromagneticLabStrings.magneticUnitsPreferencesLabelStringProperty, {
      font: FELConstants.PREFERENCES_LABEL_FONT,
      maxWidth: FELConstants.PREFERENCES_LABEL_MAX_WIDTH,
      tandem: tandem.createTandem( 'labelText' )
    } );

    const radioButtonGroup = new MagneticUnitsRadioButtonGroup( magneticUnitsProperty,
      tandem.createTandem( 'radioButtonGroup' ) );

    super( {
      labelNode: labelText,
      controlNode: radioButtonGroup,
      labelSpacing: 20,
      tandem: tandem,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    this.disposeMagneticUnitsPreferencesControl = () => {
      labelText.dispose();
      radioButtonGroup.dispose();
    };
  }

  public override dispose(): void {
    this.disposeMagneticUnitsPreferencesControl();
    super.dispose();
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
        createNode: radioButtonTandem => new MagneticUnitsRadioButtonText( FaradaysElectromagneticLabStrings.units.GStringProperty, radioButtonTandem ),
        tandemName: `x${AquaRadioButton.TANDEM_NAME_SUFFIX}`
      },
      {
        value: 'T',
        createNode: radioButtonTandem => new MagneticUnitsRadioButtonText( FaradaysElectromagneticLabStrings.units.TStringProperty, radioButtonTandem ),
        tandemName: `t${AquaRadioButton.TANDEM_NAME_SUFFIX}`
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
      font: PreferencesDialog.CONTENT_FONT,
      maxWidth: 100,
      tandem: radioButtonTandem.createTandem( 'text' )
    } );
  }
}

faradaysElectromagneticLab.register( 'MagneticUnitsPreferencesControl', MagneticUnitsPreferencesControl );
