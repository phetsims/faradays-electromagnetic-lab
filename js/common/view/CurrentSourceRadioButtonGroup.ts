// Copyright 2023, University of Colorado Boulder

/**
 * CurrentSourceRadioButtonGroup is radio button group for choosing a current source for the electromagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { CurrentSource } from '../model/CurrentSource.js';
import FELConstants from '../FELConstants.js';
import BatteryNode from './BatteryNode.js';
import ACPowerSupplyNode from './ACPowerSupplyNode.js';

const ICON_SCALE = 0.65;

export default class CurrentSourceRadioButtonGroup extends RectangularRadioButtonGroup<CurrentSource> {

  public constructor( indicatorProperty: StringUnionProperty<CurrentSource>, tandem: Tandem ) {

    const items: RectangularRadioButtonGroupItem<CurrentSource>[] = [
      {
        value: 'battery',
        createNode: ( tandem: Tandem ) => BatteryNode.createIcon( ICON_SCALE ),
        tandemName: 'batteryRadioButton'
      },
      {
        value: 'acPowerSupply',
        createNode: ( tandem: Tandem ) => ACPowerSupplyNode.createIcon( ICON_SCALE ),
        tandemName: 'acPowerSupplyRadioButton'
      }
    ];

    super( indicatorProperty, items, {
      orientation: 'horizontal',

      // Prevent space between radio buttons, and center them in the parent Panel.
      layoutOptions: { stretch: false, align: 'center' },
      radioButtonOptions: FELConstants.RECTANGULAR_RADIO_BUTTON_OPTIONS,
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'CurrentSourceRadioButtonGroup', CurrentSourceRadioButtonGroup );