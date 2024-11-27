// Copyright 2024, University of Colorado Boulder

/**
 * CurrentCheckbox is the checkbox labeled as 'Electrons' or 'Conventional Current', used to show/hide current in a coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELConstants from '../FELConstants.js';
import { CurrentFlow } from '../FELQueryParameters.js';
import ElectronNode from './ElectronNode.js';
import PositiveChargeNode from './PositiveChargeNode.js';

export default class CurrentCheckbox extends Checkbox {

  public constructor( currentVisibleProperty: Property<boolean>, currentFlowProperty: TReadOnlyProperty<CurrentFlow>, tandem: Tandem ) {

    const stringProperty = new DerivedProperty(
      [ currentFlowProperty, FaradaysElectromagneticLabStrings.electronsStringProperty, FaradaysElectromagneticLabStrings.conventionalCurrentStringProperty ],
      ( currentFlow, electronsString, conventionalCurrentString ) =>
        ( currentFlow === 'electron' ) ? electronsString : conventionalCurrentString );

    const textNode = new Text( stringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS );

    const iconToggleNode = new ToggleNode<CurrentFlow>( currentFlowProperty, [
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