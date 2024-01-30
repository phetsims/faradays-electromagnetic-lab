// Copyright 2024, University of Colorado Boulder

/**
 * EarthHemispherePreferencesControl is the control in the Preferences dialog for selecting the Earth image.
 * It is a labeled group of radio buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EarthHemisphere, EarthHemisphereValues } from '../../FELQueryParameters.js';
import StringUnionProperty from '../../../../../axon/js/StringUnionProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import PreferencesControl, { PreferencesControlOptions } from '../../../../../joist/js/preferences/PreferencesControl.js';
import { Image, Text } from '../../../../../scenery/js/imports.js';
import FELConstants from '../../FELConstants.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import RectangularRadioButton from '../../../../../sun/js/buttons/RectangularRadioButton.js';
import FELColors from '../../FELColors.js';
import faradaysElectromagneticLab from '../../../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabStrings from '../../../FaradaysElectromagneticLabStrings.js';
import earthEasternHemisphere_svg from '../../../../images/earthEasternHemisphere_svg.js';
import earthWesternHemisphere_svg from '../../../../images/earthWesternHemisphere_svg.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';

export default class EarthHemispherePreferencesControl extends PreferencesControl {

  public constructor( earthImageProperty: StringUnionProperty<EarthHemisphere>, tandem: Tandem ) {

    const labelText = new Text( FaradaysElectromagneticLabStrings.earthHemisphereStringProperty, {
      font: FELConstants.PREFERENCES_LABEL_FONT,
      maxWidth: FELConstants.PREFERENCES_LABEL_MAX_WIDTH
    } );

    const radioButtonGroup = new EarthHemisphereRadioButtonGroup( earthImageProperty,
      tandem.createTandem( 'radioButtonGroup' ) );

    super( combineOptions<PreferencesControlOptions>( {
      labelNode: labelText,
      controlNode: radioButtonGroup,
      tandem: tandem
    }, FELConstants.PREFERENCES_CONTROL_OPTIONS ) );
  }
}

/**
 * The radio button group for this control.
 */
class EarthHemisphereRadioButtonGroup extends RectangularRadioButtonGroup<EarthHemisphere> {

  public constructor( earthImageProperty: StringUnionProperty<EarthHemisphere>, tandem: Tandem ) {

    const items: RectangularRadioButtonGroupItem<EarthHemisphere>[] = EarthHemisphereValues.map( value => {
      return {
        value: value,
        createNode: () => new EarthHemisphereRadioButtonLabel( value ),
        tandemName: `${value}${RectangularRadioButton.TANDEM_NAME_SUFFIX}`
      };
    } );

    super( earthImageProperty, items, {
      orientation: 'horizontal',
      radioButtonOptions: {
        baseColor: FELColors.screenBackgroundColorProperty,
        buttonAppearanceStrategyOptions: {
          selectedLineWidth: 3,
          selectedStroke: 'rgb( 262, 68, 147 )'
        },
        xMargin: 7,
        yMargin: 7,
        phetioVisiblePropertyInstrumented: false
      },
      phetioVisiblePropertyInstrumented: false,
      tandem: tandem
    } );
  }
}

/**
 * Labels for the radio buttons.
 */
class EarthHemisphereRadioButtonLabel extends Image {

  public constructor( value: EarthHemisphere ) {
    super( ( value === 'western' ) ? earthWesternHemisphere_svg : earthEasternHemisphere_svg, {
      scale: 0.1
    } );
  }
}

faradaysElectromagneticLab.register( 'EarthHemispherePreferencesControl', EarthHemispherePreferencesControl );
