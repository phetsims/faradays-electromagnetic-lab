// Copyright 2024, University of Colorado Boulder

//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/136 Rename to CurrentCheckbox, label 'Current'?
/**
 * ElectronsCheckbox is the checkbox labeled 'Electrons', used to show/hide electrons in a coil.
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
import ElectronsNode from './ElectronsNode.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import { CurrentType } from '../FELQueryParameters.js';
import FELPreferences from '../model/FELPreferences.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

export default class ElectronsCheckbox extends Checkbox {

  public constructor( electronsVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const stringProperty = new DerivedProperty(
      [ FELPreferences.currentTypeProperty, FaradaysElectromagneticLabStrings.electronsStringProperty, FaradaysElectromagneticLabStrings.conventionalCurrentStringProperty ],
      ( currentType, electronsString, conventionalCurrentString ) =>
        ( currentType === 'electron' ) ? electronsString : conventionalCurrentString );

    const textNode = new Text( stringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS );

    const iconToggleNode = new ToggleNode<CurrentType>( FELPreferences.currentTypeProperty, [
      {
        value: 'electron',
        createNode: tandemName => ElectronsNode.createElectronIcon()
      },
      {
        value: 'conventional',
        createNode: tandemName => ElectronsNode.createConventionalIcon()
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

    super( electronsVisibleProperty, content, options );
  }
}

faradaysElectromagneticLab.register( 'ElectronsCheckbox', ElectronsCheckbox );