// Copyright 2023, University of Colorado Boulder

/**
 * CurrentIndicatorControl is the control for choosing a device that detects current in the pickup coil.
 * It is a labeled radio button group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VoltmeterNode from './VoltmeterNode.js';
import { CurrentIndicatorType } from '../model/CurrentIndicatorType.js';
import FELConstants from '../FELConstants.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELLightBulbNode from './FELLightBulbNode.js';

export default class CurrentIndicatorControl extends HBox {

  public constructor( currentIndicatorProperty: StringUnionProperty<CurrentIndicatorType>, tandem: Tandem ) {

    const labelText = new Text( FaradaysElectromagneticLabStrings.indicatorStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );

    const radioButtonGroup = new CurrentIndicatorRadioButtonGroup( currentIndicatorProperty, tandem.createTandem( 'radioButtonGroup' ) );

    super( {
      spacing: 10,
      layoutOptions: { stretch: false },  // Prevent space between subcomponents.
      children: [ labelText, radioButtonGroup ],
      tandem: tandem
    } );
  }
}

class CurrentIndicatorRadioButtonGroup extends RectangularRadioButtonGroup<CurrentIndicatorType> {

  public constructor( currentIndicatorProperty: StringUnionProperty<CurrentIndicatorType>, tandem: Tandem ) {

    const items: RectangularRadioButtonGroupItem<CurrentIndicatorType>[] = [
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

faradaysElectromagneticLab.register( 'CurrentIndicatorControl', CurrentIndicatorControl );