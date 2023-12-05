// Copyright 2023, University of Colorado Boulder

/**
 * IndicatorRadioButtonGroup is radio button group for choosing an EMF indicator for the pickup coil.
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

const ICON_SCALE = 0.65;

export default class IndicatorRadioButtonGroup extends RectangularRadioButtonGroup<Indicator> {

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

      // Prevent space between radio buttons, and center them in the parent Panel.
      layoutOptions: { stretch: false, align: 'center' },
      radioButtonOptions: FELConstants.RECTANGULAR_RADIO_BUTTON_OPTIONS,
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'IndicatorRadioButtonGroup', IndicatorRadioButtonGroup );