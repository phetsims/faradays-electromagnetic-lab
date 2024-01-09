// Copyright 2023, University of Colorado Boulder

/**
 * EarthImagePreferencesControl is the control in the Preferences dialog for selecting the Earth image.
 * It is a labeled group of radio buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EarthImage, EarthImageValues } from '../FELQueryParameters.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import { Image, Text } from '../../../../scenery/js/imports.js';
import FELConstants from '../FELConstants.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import RectangularRadioButton from '../../../../sun/js/buttons/RectangularRadioButton.js';
import FELColors from '../FELColors.js';
import earthAfrica_png from '../../../images/earthAfrica_png.js';
import earthAmericas_png from '../../../images/earthAmericas_png.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';

export default class EarthImagePreferencesControl extends PreferencesControl {

  public constructor( earthImageProperty: StringUnionProperty<EarthImage>, tandem: Tandem ) {

    const labelText = new Text( FaradaysElectromagneticLabStrings.earthImageStringProperty, {
      font: FELConstants.PREFERENCES_LABEL_FONT,
      maxWidth: FELConstants.PREFERENCES_LABEL_MAX_WIDTH,
      tandem: tandem.createTandem( 'labelText' )
    } );

    const radioButtonGroup = new EarthImageRadioButtonGroup( earthImageProperty,
      tandem.createTandem( 'radioButtonGroup' ) );

    super( {
      isDisposable: false,
      labelNode: labelText,
      controlNode: radioButtonGroup,
      labelSpacing: 20,
      tandem: tandem,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );
  }
}

/**
 * The radio button group for this control.
 */
class EarthImageRadioButtonGroup extends RectangularRadioButtonGroup<EarthImage> {

  public constructor( earthImageProperty: StringUnionProperty<EarthImage>, tandem: Tandem ) {

    const items: RectangularRadioButtonGroupItem<EarthImage>[] = EarthImageValues.map( value => {
      return {
        value: value,
        createNode: () => new EarthImageRadioButtonLabel( value ),
        tandemName: `${value}${RectangularRadioButton.TANDEM_NAME_SUFFIX}`
      };
    } );

    super( earthImageProperty, items, {
      orientation: 'horizontal',
      radioButtonOptions: {
        baseColor: FELColors.screenBackgroundColorProperty,
        xMargin: 7,
        yMargin: 7,
        buttonAppearanceStrategyOptions: {
          selectedLineWidth: 2
        },
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
class EarthImageRadioButtonLabel extends Image {

  public constructor( value: EarthImage ) {
    super( ( value === 'africa' ) ? earthAfrica_png : earthAmericas_png, {
      scale: 0.1
    } );
  }
}

faradaysElectromagneticLab.register( 'EarthImagePreferencesControl', EarthImagePreferencesControl );
