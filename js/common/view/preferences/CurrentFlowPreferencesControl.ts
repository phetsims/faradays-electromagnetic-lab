// Copyright 2024, University of Colorado Boulder

/**
 * CurrentFlowPreferencesControl is the control in the Preferences dialog for choosing the current type: either
 * 'Electron' or 'Conventional'. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/136.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HBox, Node, RichText, Text } from '../../../../../scenery/js/imports.js';
import StringUnionProperty from '../../../../../axon/js/StringUnionProperty.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import PreferencesDialog from '../../../../../joist/js/preferences/PreferencesDialog.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import PreferencesControl, { PreferencesControlOptions } from '../../../../../joist/js/preferences/PreferencesControl.js';
import FaradaysElectromagneticLabStrings from '../../../FaradaysElectromagneticLabStrings.js';
import faradaysElectromagneticLab from '../../../faradaysElectromagneticLab.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../../sun/js/AquaRadioButtonGroup.js';
import { CurrentFlow } from '../../FELQueryParameters.js';
import FELConstants from '../../FELConstants.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import ElectronNode from '../ElectronNode.js';
import PositiveChargeNode from '../PositiveChargeNode.js';

export default class CurrentFlowPreferencesControl extends PreferencesControl {

  public constructor( currentFlowProperty: StringUnionProperty<CurrentFlow>, tandem: Tandem ) {

    const labelText = new Text( FaradaysElectromagneticLabStrings.currentFlowStringProperty, {
      font: FELConstants.PREFERENCES_LABEL_FONT,
      maxWidth: FELConstants.PREFERENCES_LABEL_MAX_WIDTH
    } );

    const radioButtonGroup = new CurrentTypeRadioButtonGroup( currentFlowProperty,
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
class CurrentTypeRadioButtonGroup extends AquaRadioButtonGroup<CurrentFlow> {

  public constructor( currentFlowProperty: StringUnionProperty<CurrentFlow>, tandem: Tandem ) {

    const items: AquaRadioButtonGroupItem<CurrentFlow>[] = [
      {
        value: 'electron',
        createNode: radioButtonTandem => new CurrentTypeRadioButtonText( FaradaysElectromagneticLabStrings.electronPreferenceStringProperty,
          ElectronNode.createIcon( 1.5 ), radioButtonTandem ),
        tandemName: 'electronRadioButton'
      },
      {
        value: 'conventional',
        createNode: radioButtonTandem => new CurrentTypeRadioButtonText( FaradaysElectromagneticLabStrings.conventionalPreferenceStringProperty,
          PositiveChargeNode.createIcon( 1.5 ), radioButtonTandem ),
        tandemName: 'conventionalRadioButton'
      }
    ];

    super( currentFlowProperty, items, {
      orientation: 'horizontal',
      spacing: 25,
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
class CurrentTypeRadioButtonText extends HBox {

  public constructor( stringProperty: TReadOnlyProperty<string>, icon: Node, radioButtonTandem: Tandem ) {

    const text = new RichText( stringProperty, {
      font: PreferencesDialog.CONTENT_FONT,
      maxWidth: 100
    } );

    super( {
      children: [ text, icon ],
      spacing: 5,
      tandem: radioButtonTandem.createTandem( 'text' )
    } );
  }
}

faradaysElectromagneticLab.register( 'CurrentFlowPreferencesControl', CurrentFlowPreferencesControl );