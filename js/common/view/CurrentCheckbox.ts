// Copyright 2024, University of Colorado Boulder

/**
 * CurrentCheckbox is the checkbox labeled 'Electrons', used to show/hide current in a coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELConstants from '../FELConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import FELPreferences from '../model/FELPreferences.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import { CurrentType } from '../FELQueryParameters.js';
import ElectronNode from './ElectronNode.js';
import PositiveChargeNode from './PositiveChargeNode.js';

export default class CurrentCheckbox extends Checkbox {

  public constructor( currentVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const stringProperty = new DerivedProperty(
      [ FELPreferences.currentTypeProperty, FaradaysElectromagneticLabStrings.electronsStringProperty, FaradaysElectromagneticLabStrings.conventionalCurrentStringProperty ],
      ( currentType, electronsString, conventionalCurrentString ) =>
        ( currentType === 'electron' ) ? electronsString : conventionalCurrentString );

    const textNode = new Text( stringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS );

    const iconToggleNode = new ToggleNode<CurrentType>( FELPreferences.currentTypeProperty, [
      {
        value: 'electron',
        createNode: tandemName => ElectronNode.createIcon( 1.5 )
      },
      {
        value: 'conventional',
        createNode: tandemName => PositiveChargeNode.createIcon( 1.5 )
      }
    ] );

    const content = new HBox( {
      spacing: 8,
      children: [ textNode, iconToggleNode ]
    } );

    const options = combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
      layoutOptions: {
        stretch: false // No space between text and icon
      },
      tandem: tandem
    } );

    super( currentVisibleProperty, content, options );
  }
}

faradaysElectromagneticLab.register( 'CurrentCheckbox', CurrentCheckbox );