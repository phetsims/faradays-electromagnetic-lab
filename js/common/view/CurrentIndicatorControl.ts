// Copyright 2023, University of Colorado Boulder

/**
 * CurrentIndicatorControl is the control for choosing a device that detects current in the pickup coil.
 * It is a labeled radio button group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VoltmeterNode from './VoltmeterNode.js';
import FELConstants from '../FELConstants.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELLightBulbNode from './FELLightBulbNode.js';
import CurrentIndicator from '../model/CurrentIndicator.js';
import PickupCoil from '../model/PickupCoil.js';

export default class CurrentIndicatorControl extends HBox {

  public constructor( pickupCoil: PickupCoil, tandem: Tandem ) {

    const labelText = new Text( FaradaysElectromagneticLabStrings.indicatorStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );

    const radioButtonGroup = new CurrentIndicatorRadioButtonGroup( pickupCoil, tandem.createTandem( 'radioButtonGroup' ) );

    super( {
      spacing: 10,
      layoutOptions: { stretch: false },  // Prevent space between subcomponents.
      children: [ labelText, radioButtonGroup ],
      tandem: tandem
    } );
  }
}

class CurrentIndicatorRadioButtonGroup extends RectangularRadioButtonGroup<CurrentIndicator> {

  public constructor( pickupCoil: PickupCoil, tandem: Tandem ) {

    const items: RectangularRadioButtonGroupItem<CurrentIndicator>[] = [
      {
        value: pickupCoil.lightBulb,
        createNode: () => FELLightBulbNode.createIcon(),
        tandemName: 'lightBulbRadioButton'
      },
      {
        value: pickupCoil.voltmeter,
        createNode: () => VoltmeterNode.createIcon(),
        tandemName: 'voltmeterRadioButton'
      }
    ];

    super( pickupCoil.currentIndicatorProperty, items, {
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