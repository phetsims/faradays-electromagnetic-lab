// Copyright 2023, University of Colorado Boulder

/**
 * CurrentSourceControl is radio button group for choosing a current source for the electromagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FELConstants from '../FELConstants.js';
import BatteryNode from './BatteryNode.js';
import ACPowerSupplyNode from './ACPowerSupplyNode.js';
import { HBox, RichText } from '../../../../scenery/js/imports.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import Electromagnet from '../model/Electromagnet.js';
import CurrentSource from '../model/CurrentSource.js';

export default class CurrentSourceControl extends HBox {

  public constructor( electromagnet: Electromagnet, tandem: Tandem ) {

    const labelText = new RichText( FaradaysElectromagneticLabStrings.currentSourceStringProperty, {
      font: FELConstants.CONTROL_FONT,
      maxWidth: 60,
      maxHeight: 40 // RichText may be multiline
    } );

    const radioButtonGroup = new CurrentSourceRadioButtonGroup( electromagnet, tandem.createTandem( 'radioButtonGroup' ) );

    super( {
      spacing: 10,
      layoutOptions: { stretch: false },  // Prevent space between subcomponents.
      children: [ labelText, radioButtonGroup ],
      tandem: tandem
    } );
  }
}

class CurrentSourceRadioButtonGroup extends RectangularRadioButtonGroup<CurrentSource> {

  public constructor( electromagnet: Electromagnet, tandem: Tandem ) {

    const items: RectangularRadioButtonGroupItem<CurrentSource>[] = [
      {
        value: electromagnet.battery,
        createNode: ( tandem: Tandem ) => BatteryNode.createIcon(),
        tandemName: 'batteryRadioButton'
      },
      {
        value: electromagnet.acPowerSupply,
        createNode: ( tandem: Tandem ) => ACPowerSupplyNode.createIcon(),
        tandemName: 'acPowerSupplyRadioButton'
      }
    ];

    super( electromagnet.currentSourceProperty, items, {
      isDisposable: false,
      orientation: 'horizontal',
      spacing: 10,
      radioButtonOptions: FELConstants.RECTANGULAR_RADIO_BUTTON_OPTIONS,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false // use currentSourceControl.visibleProperty
    } );
  }
}

faradaysElectromagneticLab.register( 'CurrentSourceControl', CurrentSourceControl );