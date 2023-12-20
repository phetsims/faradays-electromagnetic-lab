// Copyright 2023, University of Colorado Boulder

/**
 * CurrentSourceControl is radio button group for choosing a current source for the electromagnet.
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
import { HBox, RichText } from '../../../../scenery/js/imports.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';

const ICON_SCALE = 0.65;

export default class CurrentSourceControl extends HBox {

  public constructor( currentSourceProperty: StringUnionProperty<CurrentSource>, tandem: Tandem ) {

    const labelText = new RichText( FaradaysElectromagneticLabStrings.currentSourceStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );

    const radioButtonGroup = new CurrentSourceRadioButtonGroup( currentSourceProperty, tandem.createTandem( 'radioButtonGroup' ) );

    super( {
      spacing: 10,
      layoutOptions: { stretch: false },  // Prevent space between subcomponents.
      children: [ labelText, radioButtonGroup ],
      tandem: tandem
    } );
  }
}

class CurrentSourceRadioButtonGroup extends RectangularRadioButtonGroup<CurrentSource> {

  public constructor( currentSourceProperty: StringUnionProperty<CurrentSource>, tandem: Tandem ) {

    const items: RectangularRadioButtonGroupItem<CurrentSource>[] = [
      {
        value: 'battery',
        createNode: ( tandem: Tandem ) => BatteryNode.createIcon(),
        tandemName: 'batteryRadioButton'
      },
      {
        value: 'acPowerSupply',
        createNode: ( tandem: Tandem ) => ACPowerSupplyNode.createIcon( ICON_SCALE ),
        tandemName: 'acPowerSupplyRadioButton'
      }
    ];

    super( currentSourceProperty, items, {
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