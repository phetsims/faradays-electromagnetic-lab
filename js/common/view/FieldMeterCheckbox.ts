// Copyright 2024-2025, University of Colorado Boulder

/**
 * FieldMeterCheckbox is the checkbox labeled 'Field Meter', used to show/hide the field meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELColors from '../FELColors.js';
import FELConstants from '../FELConstants.js';

export default class FieldMeterCheckbox extends Checkbox {

  public constructor( fieldMeterVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const content = new HBox( {
      spacing: 8,
      children: [
        new Text( FaradaysElectromagneticLabStrings.fieldMeterStringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS ),
        createIcon()
      ]
    } );

    const options = combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
      tandem: tandem
    } );

    super( fieldMeterVisibleProperty, content, options );
  }
}

/**
 * Creates the icon for this checkbox, the field meter's probe.
 * See https://github.com/phetsims/faradays-electromagnetic-lab/issues/85.
 */
function createIcon(): Node {

  const radius = 8;
  const lineWidth = 3;

  const probe = new Circle( radius, {
    stroke: FELColors.fieldMeterProbeColorProperty,
    lineWidth: lineWidth
  } );

  const stem = new Line( 0, 0, 0, 0.6 * radius, {
    stroke: FELColors.fieldMeterProbeColorProperty,
    lineCap: 'round',
    lineWidth: lineWidth,
    centerX: probe.centerX,
    top: probe.bottom - 1
  } );

  const crosshairs = new PlusNode( {
    size: new Dimension2( 1.3 * radius, 1 ),
    fill: 'black',
    center: probe.center
  } );

  return new Node( {
    children: [ stem, probe, crosshairs ]
  } );
}

faradaysElectromagneticLab.register( 'FieldMeterCheckbox', FieldMeterCheckbox );