// Copyright 2024, University of Colorado Boulder

/**
 * LockToAxisCheckbox is the checkbox labeled 'Lock to Axis', used to lock dragging of the magnet and pickup coil to
 * the x-axis of the pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import { HBox, Line, Node, Path, Text } from '../../../../scenery/js/imports.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELConstants from '../FELConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FELColors from '../FELColors.js';
import { Shape } from '../../../../kite/js/imports.js';

export default class LockToAxisCheckbox extends Checkbox {

  public constructor( isLockedToAxisProperty: Property<boolean>, tandem: Tandem ) {

    const content = new HBox( {
      spacing: 8,
      children: [
        new Text( FaradaysElectromagneticLabStrings.lockToAxisStringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS ),
        createIcon()
      ]
    } );

    super( isLockedToAxisProperty, content, combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
      layoutOptions: {
        stretch: false
      },
      tandem: tandem
    } ) );
  }
}

/**
 * Creates the icon for this checkbox, a horizontal dashed line with arrow heads at both ends.
 */
function createIcon(): Node {

  const dashLength = 5;
  const headWidth = 5;
  const headHeight = 5;
  const numberOfDashes = 4;

  const line = new Line( 0, 0, ( 2 * numberOfDashes - 1 ) * dashLength, 0, {
    stroke: FELColors.pickupCoilAxisStrokeProperty,
    lineWidth: 2,
    lineDash: [ dashLength, dashLength ]
  } );

  const leftHead = new Path( new Shape().moveTo( 0, 0 ).lineTo( headWidth, -headHeight ).lineTo( headWidth, headHeight ).close(), {
    fill: FELColors.pickupCoilAxisStrokeProperty
  } );

  const rightHead = new Path( new Shape().moveTo( 0, 0 ).lineTo( -headWidth, -headHeight ).lineTo( -headWidth, headHeight ).close(), {
    fill: FELColors.pickupCoilAxisStrokeProperty
  } );

  return new HBox( {
    spacing: 0,
    children: [ leftHead, line, rightHead ]
  } );
}

faradaysElectromagneticLab.register( 'LockToAxisCheckbox', LockToAxisCheckbox );