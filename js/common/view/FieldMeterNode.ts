// Copyright 2023, University of Colorado Boulder

//TODO This is a rudimentary implementation
//TODO color profile
/**
 * FieldMeterNode is the visual representation of meter for measuring the B-field.
 * It can be dragged to a specific position, and shows the field vector's magnitude, x and y components, and angle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FieldMeter from '../model/FieldMeter.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { DragListener, KeyboardDragListener, KeyboardDragListenerOptions, Node, Path, Rectangle, RichText } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

export default class FieldMeterNode extends Node {

  public constructor( fieldMeter: FieldMeter, visibleProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) {

    const probeWidth = 10;
    const probeHeight = 40;
    const probeShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( probeWidth / 2, probeWidth / 2 )
      .lineTo( probeWidth / 2, probeHeight )
      .lineTo( -probeWidth / 2, probeHeight )
      .lineTo( -probeWidth / 2, probeWidth / 2 )
      .close();
    const probeNode = new Path( probeShape, {
      fill: 'rgb( 17, 33, 255 )',
      stroke: 'white'
    } );

    const bodyNode = new Rectangle( 0, 0, 100, 100, {
      cornerRadius: 10,
      fill: 'rgb( 17, 33, 255 )',
      stroke: 'white',
      centerX: probeNode.centerX,
      top: probeNode.bottom - 2
    } );

    const valuesStringProperty = new DerivedProperty(
      [ fieldMeter.fieldVectorProperty, FaradaysElectromagneticLabStrings.units.gaussStringProperty ],
      ( fieldVector, gaussString ) => {
        const B = Utils.toFixed( fieldVector.magnitude, 2 );
        const Bx = Utils.toFixed( fieldVector.x, 2 );
        const By = Utils.toFixed( fieldVector.y, 2 );
        const theta = Utils.toFixed( Utils.toDegrees( fieldVector.angle ), 2 );
        return `B = ${B} ${gaussString}<br>` +
               `B<sub>x</sub> = ${Bx} ${gaussString}<br>` +
               `B<sub>y</sub> = ${By} ${gaussString}<br>` +
               `${MathSymbols.THETA} = ${theta}${MathSymbols.DEGREES}`;
      } );

    const valuesText = new RichText( valuesStringProperty, {
      font: new PhetFont( 14 ),
      fill: 'white',
      leading: 5
    } );
    valuesText.boundsProperty.link( bounds => {
      valuesText.left = bodyNode.left + 10;
      valuesText.centerY = bodyNode.centerY;
    } );

    super( {
      children: [ probeNode, bodyNode, valuesText ],
      cursor: 'pointer',
      visibleProperty: visibleProperty,
      tagName: 'div', // for KeyboardDragListener
      focusable: true, // for KeyboardDragListener
      tandem: tandem
    } );

    fieldMeter.positionProperty.link( position => {
      this.translation = position;
    } );

    const dragListener = new DragListener( {
      positionProperty: fieldMeter.positionProperty,
      useParentOffset: true,
      tandem: tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener(
      combineOptions<KeyboardDragListenerOptions>( {}, FELConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
        positionProperty: fieldMeter.positionProperty,
        tandem: tandem.createTandem( 'keyboardDragListener' )
      } ) );
    this.addInputListener( keyboardDragListener );
  }
}

faradaysElectromagneticLab.register( 'FieldMeterNode', FieldMeterNode );

