// Copyright 2023, University of Colorado Boulder

//TODO dragBounds

/**
 * FieldMeterNode is the visual representation of meter for measuring the B-field.
 * It can be dragged to a specific position, and shows the field vector's magnitude, x and y components, and angle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FieldMeter from '../model/FieldMeter.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { DragListener, KeyboardDragListener, KeyboardDragListenerOptions, Node, Path, RichText, VBox } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import FELColors from '../FELColors.js';

const CROSSHAIRS_RADIUS = 10;
const PROBE_RADIUS = CROSSHAIRS_RADIUS + 8;

export default class FieldMeterNode extends Node {

  public constructor( fieldMeter: FieldMeter, visibleProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) {

    // Origin at the center of the crosshairs
    const crosshairsShape = new Shape()
      .moveTo( -CROSSHAIRS_RADIUS, 0 )
      .lineTo( CROSSHAIRS_RADIUS, 0 )
      .moveTo( 0, -CROSSHAIRS_RADIUS )
      .lineTo( 0, CROSSHAIRS_RADIUS );
    const crosshairsNode = new Path( crosshairsShape, {
      stroke: FELColors.fieldMeterCrosshairsColorProperty,
      lineWidth: 2
    } );

    const probeShape = new Shape()
      .circle( 0, 0, PROBE_RADIUS )
      .moveTo( 0, PROBE_RADIUS )
      .lineTo( 0, PROBE_RADIUS + 15 );
    const probeNode = new Path( probeShape, {
      stroke: FELColors.fieldMeterProbeColorProperty,
      lineWidth: 5
    } );

    const bodyNode = new ShadedRectangle( new Bounds2( 0, 0, 100, 100 ), {
      cornerRadius: 10,
      baseColor: FELColors.fieldMeterBodyColorProperty,
      centerX: probeNode.centerX,
      top: probeNode.bottom - 2
    } );

    const BStringProperty = new DerivedProperty(
      [ fieldMeter.fieldVectorProperty, FaradaysElectromagneticLabStrings.units.gaussStringProperty ],
      ( fieldVector, gaussString ) => `B = ${Utils.toFixed( fieldVector.magnitude, 2 )} ${gaussString}`
    );
    const BxStringProperty = new DerivedProperty(
      [ fieldMeter.fieldVectorProperty, FaradaysElectromagneticLabStrings.units.gaussStringProperty ],
      ( fieldVector, gaussString ) => `B<sub>x</sub> = ${Utils.toFixed( fieldVector.x, 2 )} ${gaussString}`
    );
    const ByStringProperty = new DerivedProperty(
      [ fieldMeter.fieldVectorProperty, FaradaysElectromagneticLabStrings.units.gaussStringProperty ],
      ( fieldVector, gaussString ) => `B<sub>y</sub> = ${Utils.toFixed( fieldVector.y, 2 )} ${gaussString}`
    );
    const thetaStringProperty = new DerivedProperty(
      [ fieldMeter.fieldVectorProperty ],
      fieldVector => `${MathSymbols.THETA} = ${Utils.toFixed( Utils.toDegrees( fieldVector.angle ), 2 )}${MathSymbols.DEGREES}`
    );

    const richTextOptions = {
      font: new PhetFont( 14 ),
      fill: FELColors.fieldMeterLabelsColorProperty
    };
    const BText = new RichText( BStringProperty, richTextOptions );
    const BxText = new RichText( BxStringProperty, richTextOptions );
    const ByText = new RichText( ByStringProperty, richTextOptions );
    const thetaText = new RichText( thetaStringProperty, richTextOptions );

    const textVBox = new VBox( {
      align: 'left',
      spacing: 5,
      children: [
        BText,
        BxText,
        ByText,
        thetaText
      ]
    } );
    textVBox.boundsProperty.link( bounds => {
      textVBox.left = bodyNode.left + 10;
      textVBox.centerY = bodyNode.centerY;
    } );

    super( {
      children: [ probeNode, crosshairsNode, bodyNode, textVBox ],
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

