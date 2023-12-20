// Copyright 2023, University of Colorado Boulder

//TODO Give this a more descriptive name.

/**
 * IndicatorControl is the control for choosing an EMF indicator for the pickup coil. It is a labeled radio button group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VoltmeterNode from './VoltmeterNode.js';
import { CurrentIndicator } from '../model/CurrentIndicator.js';
import FELConstants from '../FELConstants.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELLightBulbNode from './FELLightBulbNode.js';

export default class IndicatorControl extends HBox {

  public constructor( currentIndicatorProperty: StringUnionProperty<CurrentIndicator>, tandem: Tandem ) {

    const labelText = new Text( FaradaysElectromagneticLabStrings.indicatorStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );

    const radioButtonGroup = new IndicatorRadioButtonGroup( currentIndicatorProperty, tandem.createTandem( 'radioButtonGroup' ) );

    super( {
      spacing: 10,
      layoutOptions: { stretch: false },  // Prevent space between subcomponents.
      children: [ labelText, radioButtonGroup ],
      tandem: tandem
    } );
  }
}

class IndicatorRadioButtonGroup extends RectangularRadioButtonGroup<CurrentIndicator> {

  public constructor( currentIndicatorProperty: StringUnionProperty<CurrentIndicator>, tandem: Tandem ) {

    const items: RectangularRadioButtonGroupItem<CurrentIndicator>[] = [
      {
        value: 'lightBulb',
        createNode: ( tandem: Tandem ) => FELLightBulbNode.createIcon(),
        tandemName: 'lightBulbRadioButton'
      },
      {
        value: 'voltmeter',
        createNode: ( tandem: Tandem ) => VoltmeterNode.createIcon(),
        tandemName: 'voltmeterRadioButton'
      }
    ];

    super( currentIndicatorProperty, items, {
      isDisposable: false,
      orientation: 'horizontal',
      spacing: 10,
      radioButtonOptions: FELConstants.RECTANGULAR_RADIO_BUTTON_OPTIONS,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false // use indicatorControl.visibleProperty
    } );
  }
}

faradaysElectromagneticLab.register( 'IndicatorControl', IndicatorControl );