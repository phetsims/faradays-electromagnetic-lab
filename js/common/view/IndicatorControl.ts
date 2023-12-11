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
import LightBulbNode from './LightBulbNode.js';
import VoltmeterNode from './VoltmeterNode.js';
import { Indicator } from '../model/Indicator.js';
import FELConstants from '../FELConstants.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';

const ICON_SCALE = 0.65;

export default class IndicatorControl extends HBox {

  public constructor( indicatorProperty: StringUnionProperty<Indicator>, tandem: Tandem ) {

    const labelText = new Text( FaradaysElectromagneticLabStrings.indicatorStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );

    const radioButtonGroup = new IndicatorRadioButtonGroup( indicatorProperty, tandem.createTandem( 'radioButtonGroup' ) );

    super( {
      spacing: 10,
      layoutOptions: { stretch: false },  // Prevent space between subcomponents.
      children: [ labelText, radioButtonGroup ],
      tandem: tandem
    } );
  }
}

class IndicatorRadioButtonGroup extends RectangularRadioButtonGroup<Indicator> {

  public constructor( indicatorProperty: StringUnionProperty<Indicator>, tandem: Tandem ) {

    const items: RectangularRadioButtonGroupItem<Indicator>[] = [
      {
        value: 'lightBulb',
        createNode: ( tandem: Tandem ) => LightBulbNode.createIcon( ICON_SCALE ),
        tandemName: 'lightBulbRadioButton'
      },
      {
        value: 'voltmeter',
        createNode: ( tandem: Tandem ) => VoltmeterNode.createIcon( ICON_SCALE ),
        tandemName: 'voltmeterRadioButton'
      }
    ];

    super( indicatorProperty, items, {
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