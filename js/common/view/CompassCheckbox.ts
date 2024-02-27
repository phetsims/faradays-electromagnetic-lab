// Copyright 2024, University of Colorado Boulder

/**
 * CompassCheckbox is the checkbox labeled 'Compass', used to show/hide the compass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import { HBox, Node, Text, TextOptions } from '../../../../scenery/js/imports.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELConstants from '../FELConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import CompassNeedleNode from './CompassNeedleNode.js';

// Options for the 'N' and 'S' labels on the icon.
const NS_TEXT_OPTIONS: TextOptions = {
  font: new PhetFont( 13 ),
  maxWidth: 10
};

export default class CompassCheckbox extends Checkbox {

  public constructor( compassVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const content = new HBox( {
      spacing: 8,
      children: [
        new Text( FaradaysElectromagneticLabStrings.compassStringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS ),
        createIcon()
      ]
    } );

    const options = combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
      tandem: tandem
    } );

    super( compassVisibleProperty, content, options );
  }
}

/**
 * Creates the icon for this checkbox, a compass needle labeled 'N' and 'S' on its ends.
 * See https://github.com/phetsims/faradays-electromagnetic-lab/issues/85.
 */
function createIcon(): Node {

  return new HBox( {
    children: [
      new Text( FaradaysElectromagneticLabStrings.symbol.SStringProperty, NS_TEXT_OPTIONS ),
      new CompassNeedleNode( { length: 30 } ),
      new Text( FaradaysElectromagneticLabStrings.symbol.NStringProperty, NS_TEXT_OPTIONS )
    ],
    spacing: 3,
    layoutOptions: {
      stretch: false // prevent space from being introduced between text and needle
    }
  } );
}

faradaysElectromagneticLab.register( 'CompassCheckbox', CompassCheckbox );