// Copyright 2024, University of Colorado Boulder

/**
 * CompassCheckbox is the checkbox labeled 'Compass', used to show/hide the compass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, HBox, Node, Text, TextOptions } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELColors from '../FELColors.js';
import FELConstants from '../FELConstants.js';
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

  const needleNode = new CompassNeedleNode( { length: 30 } );

  const anchorNode = new Circle( 2, {
    fill: FELColors.compassNeedleAnchorColorProperty,
    center: needleNode.center
  } );

  const iconNode = new Node( {
    children: [ needleNode, anchorNode ]
  } );

  return new HBox( {
    children: [
      new Text( FaradaysElectromagneticLabStrings.symbol.SStringProperty, NS_TEXT_OPTIONS ),
      iconNode,
      new Text( FaradaysElectromagneticLabStrings.symbol.NStringProperty, NS_TEXT_OPTIONS )
    ],
    spacing: 3,
    layoutOptions: {
      stretch: false // Prevent space from being introduced between text and needle.
    }
  } );
}

faradaysElectromagneticLab.register( 'CompassCheckbox', CompassCheckbox );