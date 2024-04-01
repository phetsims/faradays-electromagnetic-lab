// Copyright 2024, University of Colorado Boulder

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

export default class ElectronsCheckbox extends Checkbox {

  public constructor( electronsVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const content = new HBox( {
      spacing: 8,
      children: [
        new Text( FaradaysElectromagneticLabStrings.electronsStringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS ),
        ElectronsNode.createIcon()
      ]
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