// Copyright 2024, University of Colorado Boulder

/**
 * LockToAxisCheckbox is the checkbox labeled 'Lock to Axis', used to lock dragging of the magnet and pickup coil to
 * the horizontal axis that goes through the center of the pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELColors from '../FELColors.js';
import FELConstants from '../FELConstants.js';

export default class LockToAxisCheckbox extends Checkbox {

  public constructor( lockToAxisProperty: Property<boolean>, tandem: Tandem ) {

    const content = new HBox( {
      spacing: 8,
      children: [
        new Text( FaradaysElectromagneticLabStrings.lockToAxisStringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS ),
        createIcon()
      ]
    } );

    const options = combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
      tandem: tandem
    } );

    super( lockToAxisProperty, content, options );
  }
}

/**
 * Creates the icon for this checkbox, a horizontal dashed line with arrows at both ends.
 */
function createIcon(): Node {

  const lineWidth = 2;
  const dashLength = 5; // length of positive and negative segments in the dash pattern
  const numberOfDashes = 5; // number of positive segments in the dash pattern that appear between the 2 arrows

  return new Line( 0, 0, ( 2 * numberOfDashes - 1 ) * dashLength, 0, {
    stroke: FELColors.pickupCoilAxisStrokeProperty,
    lineWidth: lineWidth,
    lineDash: [ dashLength, dashLength ]
  } );
}

faradaysElectromagneticLab.register( 'LockToAxisCheckbox', LockToAxisCheckbox );