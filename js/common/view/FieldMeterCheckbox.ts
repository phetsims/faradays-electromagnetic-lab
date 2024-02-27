// Copyright 2024, University of Colorado Boulder

/**
 * FieldMeterCheckbox is the checkbox labeled 'Field Meter', used to show/hide the field meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import { Circle, HBox, Node, Text } from '../../../../scenery/js/imports.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELConstants from '../FELConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FELColors from '../FELColors.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import { Dimension2 } from '../../../../dot/js/imports.js';

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

  const circle = new Circle( 10, {
    stroke: FELColors.fieldMeterProbeColorProperty,
    lineWidth: 3
  } );

  const crosshairs = new PlusNode( {
    size: new Dimension2( 13, 1 ),
    fill: 'black',
    center: circle.center
  } );

  return new Node( {
    children: [ circle, crosshairs ]
  } );
}

faradaysElectromagneticLab.register( 'FieldMeterCheckbox', FieldMeterCheckbox );