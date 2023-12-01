// Copyright 2023, University of Colorado Boulder

//TODO dragBounds
//TODO design & polish presentation of labels and values
//TODO add overline to 'B' magnitudes
//TODO display tesla in scientific notation, M.MM x 10^-N
//TODO how should zero be displayed? 0.00? 0?

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
import FELPreferences from '../model/FELPreferences.js';

const BStringProperty = FaradaysElectromagneticLabStrings.symbol.BStringProperty;
const xStringProperty = FaradaysElectromagneticLabStrings.symbol.xStringProperty;
const yStringProperty = FaradaysElectromagneticLabStrings.symbol.yStringProperty;
const GStringProperty = FaradaysElectromagneticLabStrings.units.GStringProperty;
const TStringProperty = FaradaysElectromagneticLabStrings.units.TStringProperty;

const G_DECIMAL_PLACES = 2;
const T_DECIMAL_PLACES = 6;
const CROSSHAIRS_RADIUS = 10;
const PROBE_RADIUS = CROSSHAIRS_RADIUS + 8;
const RICH_TEXT_OPTIONS = {
  font: new PhetFont( 14 ),
  fill: FELColors.fieldMeterLabelsColorProperty
};

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

    const bodyNode = new ShadedRectangle( new Bounds2( 0, 0, 125, 100 ), {
      cornerRadius: 10,
      baseColor: FELColors.fieldMeterBodyColorProperty,
      centerX: probeNode.centerX,
      top: probeNode.bottom - 2
    } );

    // These strings have unconventional names so that they correspond to B, Bx, By, as shown in the UI.
    const stringBProperty = new DerivedProperty(
      [ FELPreferences.magneticUnitsProperty, fieldMeter.fieldVectorProperty, BStringProperty, GStringProperty, TStringProperty ],
      ( magneticUnits, fieldVector, B, G, T ) =>
        ( magneticUnits === 'G' ) ? `${B} = ${Utils.toFixed( fieldVector.magnitude, G_DECIMAL_PLACES )} ${G}`
                                  : `${B} = ${Utils.toFixed( fieldVector.magnitude / 10000, T_DECIMAL_PLACES )} ${T}`
    );
    const stringBxProperty = new DerivedProperty(
      [ FELPreferences.magneticUnitsProperty, fieldMeter.fieldVectorProperty, BStringProperty, xStringProperty, GStringProperty, TStringProperty ],
      ( magneticUnits, fieldVector, B, x, G, T ) =>
        ( magneticUnits === 'G' ) ? `${B}<sub>${x}</sub> = ${Utils.toFixed( fieldVector.x, G_DECIMAL_PLACES )} ${G}`
                                  : `${B}<sub>${x}</sub> = ${Utils.toFixed( fieldVector.x / 10000, T_DECIMAL_PLACES )} ${T}`
    );
    const stringByProperty = new DerivedProperty(
      [ FELPreferences.magneticUnitsProperty, fieldMeter.fieldVectorProperty, BStringProperty, yStringProperty, GStringProperty, TStringProperty ],
      //TODO -fieldVector.y to convert to +y up, should be done in the model
      ( magneticUnits, fieldVector, B, y, G, T ) =>
        ( magneticUnits === 'G' ) ? `${B}<sub>${y}</sub> = ${Utils.toFixed( -fieldVector.y, G_DECIMAL_PLACES )} ${G}`
                                  : `${B}<sub>${y}</sub> = ${Utils.toFixed( -fieldVector.y / 10000, T_DECIMAL_PLACES )} ${T}`
    );
    const stringThetaProperty = new DerivedProperty(
      [ fieldMeter.fieldVectorProperty ],
      //TODO -fieldVector.angle to convert to +angle counterclockwise, should be done in the model
      fieldVector => `${MathSymbols.THETA} = ${Utils.toFixed( Utils.toDegrees( -fieldVector.angle ), 2 )}${MathSymbols.DEGREES}`
    );

    // These Nodes have unconventional names so that they correspond to B, Bx, By, as shown in the UI.
    const textB = new RichText( stringBProperty, RICH_TEXT_OPTIONS );
    const textBx = new RichText( stringBxProperty, RICH_TEXT_OPTIONS );
    const textBy = new RichText( stringByProperty, RICH_TEXT_OPTIONS );
    const textTheta = new RichText( stringThetaProperty, RICH_TEXT_OPTIONS );

    const textVBox = new VBox( {
      align: 'left',
      spacing: 5,
      children: [
        textB,
        textBx,
        textBy,
        textTheta
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
      tandem: tandem,
      phetioFeatured: true,
      phetioInputEnabledPropertyInstrumented: true
    } );

    this.addLinkedElement( fieldMeter );

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

