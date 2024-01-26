// Copyright 2024, University of Colorado Boulder

/**
 * LockToAxisCheckbox is the checkbox labeled 'Lock to Axis', used to lock dragging of the magnet and pickup coil to
 * the x-axis of the pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import { HBox, Line, Node, Text } from '../../../../scenery/js/imports.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELConstants from '../FELConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FELColors from '../FELColors.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

export default class LockToAxisCheckbox extends Checkbox {

  public constructor( isLockedToAxisProperty: Property<boolean>, tandem: Tandem ) {

    const content = new HBox( {
      spacing: 8,
      children: [
        new Text( FaradaysElectromagneticLabStrings.lockToAxisStringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS ),
        createIcon()
      ]
    } );

    const options = combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
      layoutOptions: {
        stretch: false // prevent space from being introduced between text and icon
      },
      tandem: tandem
    } );

    super( isLockedToAxisProperty, content, options );
  }
}

/**
 * Creates the icon for this checkbox, a horizontal dashed line with arrows at both ends.
 */
function createIcon(): Node {

  const lineWidth = 2;
  const dashLength = 5; // length of positive and negative segments in the dash pattern
  const numberOfDashes = 2; // number of positive segments in the dash pattern that appear between the 2 arrows

  const line = new Line( 0, 0, ( 2 * numberOfDashes - 1 ) * dashLength, 0, {
    stroke: FELColors.pickupCoilAxisStrokeProperty,
    lineWidth: lineWidth,
    lineDash: [ dashLength, dashLength ]
  } );

  const arrowNodeOptions: WithRequired<ArrowNodeOptions, 'headHeight'> = {
    headWidth: 10,
    headHeight: 10,
    tailWidth: lineWidth,
    fill: FELColors.pickupCoilAxisStrokeProperty,
    stroke: null
  };
  const arrowLength = arrowNodeOptions.headHeight + dashLength;
  const leftArrow = new ArrowNode( arrowLength, 0, 0, 0, arrowNodeOptions );
  const rightArrow = new ArrowNode( 0, 0, arrowLength, 0, arrowNodeOptions );

  return new HBox( {
    spacing: dashLength,
    children: [ leftArrow, line, rightArrow ]
  } );
}

faradaysElectromagneticLab.register( 'LockToAxisCheckbox', LockToAxisCheckbox );