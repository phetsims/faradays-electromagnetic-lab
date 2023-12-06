// Copyright 2023, University of Colorado Boulder

//TODO design & polish presentation of labels and values
//TODO add overline to 'B' magnitudes
//TODO when should we display '0' vs '0.00'?

/**
 * FieldMeterNode is the visual representation of meter for measuring the B-field.
 * It can be dragged to a specific position, and shows the field vector's magnitude, x and y components, and angle.
 * The origin is at the center of the crosshairs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FieldMeter from '../model/FieldMeter.js';
import { Path, RichText, VBox } from '../../../../scenery/js/imports.js';
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
import FELMovableNode from './FELMovableNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2 from '../../../../dot/js/Vector2.js';

const BStringProperty = FaradaysElectromagneticLabStrings.symbol.BStringProperty;
const xStringProperty = FaradaysElectromagneticLabStrings.symbol.xStringProperty;
const yStringProperty = FaradaysElectromagneticLabStrings.symbol.yStringProperty;
const GStringProperty = FaradaysElectromagneticLabStrings.units.GStringProperty;
const TStringProperty = FaradaysElectromagneticLabStrings.units.TStringProperty;

const G_DECIMAL_PLACES = 2;
const T_DECIMAL_PLACES = 2;
const ANGLE_DECIMAL_PLACES = 2;
const CROSSHAIRS_RADIUS = 10;
const PROBE_RADIUS = CROSSHAIRS_RADIUS + 8;
const RICH_TEXT_OPTIONS = {
  font: new PhetFont( 14 ),
  fill: FELColors.fieldMeterLabelsColorProperty
};

export default class FieldMeterNode extends FELMovableNode {

  public constructor( fieldMeter: FieldMeter, tandem: Tandem ) {

    // Origin is at the center of the crosshairs.
    // Draw the horizontal line from left to right, then the vertical line from top to bottom.
    const crosshairsShape = new Shape()
      .moveTo( -CROSSHAIRS_RADIUS, 0 )
      .lineTo( CROSSHAIRS_RADIUS, 0 )
      .moveTo( 0, -CROSSHAIRS_RADIUS )
      .lineTo( 0, CROSSHAIRS_RADIUS );
    const crosshairsNode = new Path( crosshairsShape, {
      stroke: FELColors.fieldMeterCrosshairsColorProperty,
      lineWidth: 2
    } );

    // Origin is at the center of the circle.
    const probeShape = new Shape()
      .circle( 0, 0, PROBE_RADIUS )
      .moveTo( 0, PROBE_RADIUS )
      .lineTo( 0, PROBE_RADIUS + 15 );
    const probeNode = new Path( probeShape, {
      stroke: FELColors.fieldMeterProbeColorProperty,
      lineWidth: 5
    } );

    const bodyNode = new ShadedRectangle( new Bounds2( 0, 0, 135, 110 ), {
      cornerRadius: 10,
      baseColor: FELColors.fieldMeterBodyColorProperty,
      centerX: probeNode.centerX,
      top: probeNode.bottom - 2
    } );

    // These strings have unconventional names so that they correspond to B, Bx, By, as shown in the UI.
    const stringBProperty = new DerivedProperty(
      [ FELPreferences.magneticUnitsProperty, fieldMeter.fieldVectorProperty, BStringProperty, GStringProperty, TStringProperty ],
      ( magneticUnits, fieldVector, B, G, T ) =>
        ( magneticUnits === 'G' ) ? `${B} = ${toGaussString( fieldVector.magnitude, G )}`
                                  : `${B} = ${toTeslaString( fieldVector.magnitude, T )}`
    );
    const stringBxProperty = new DerivedProperty(
      [ FELPreferences.magneticUnitsProperty, fieldMeter.fieldVectorProperty, BStringProperty, xStringProperty, GStringProperty, TStringProperty ],
      ( magneticUnits, fieldVector, B, x, G, T ) =>
        ( magneticUnits === 'G' ) ? `${B}<sub>${x}</sub> = ${toGaussString( fieldVector.x, G )}`
                                  : `${B}<sub>${x}</sub> = ${toTeslaString( fieldVector.x, T )}`
    );
    const stringByProperty = new DerivedProperty(
      [ FELPreferences.magneticUnitsProperty, fieldMeter.fieldVectorProperty, BStringProperty, yStringProperty, GStringProperty, TStringProperty ],
      //TODO -fieldVector.y to convert to +y up, should be done in the model
      ( magneticUnits, fieldVector, B, y, G, T ) =>
        ( magneticUnits === 'G' ) ? `${B}<sub>${y}</sub> = ${toGaussString( -fieldVector.y, G )}`
                                  : `${B}<sub>${y}</sub> = ${toTeslaString( fieldVector.y, T )}`
    );
    const stringThetaProperty = new DerivedProperty(
      [ fieldMeter.fieldVectorProperty ],
      fieldVector => `${MathSymbols.THETA} = ${radiansToDegreesString( fieldVector )}`
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

    super( fieldMeter, {
      children: [ probeNode, crosshairsNode, bodyNode, textVBox ],
      visibleProperty: fieldMeter.visibleProperty,
      tandem: tandem
    } );
  }
}

/**
 * Converts a numeric gauss value to a RichText string in gauss, in decimal notation.
 */
function toGaussString( gauss: number, G: string ): string {
  if ( gauss === 0 ) {
    return `0 ${G}`;
  }
  else {
    return `${Utils.toFixed( gauss, G_DECIMAL_PLACES )} ${G}`;
  }
}

/**
 * Converts a numeric gauss value to a RichText string in tesla, in *normalized* scientific notation (0 <= |mantissa| < 10).
 */
function toTeslaString( gauss: number, T: string ): string {
  if ( gauss === 0 ) {
    return `0 ${T}`;
  }
  else {
    const tesla = ( gauss / 10000 ).toExponential( T_DECIMAL_PLACES );
    const tokens = `${tesla}`.split( 'e' );
    assert && assert( tokens.length === 2, `unexpected tokens for ${tesla}` );
    return `${tokens[ 0 ]} ${MathSymbols.TIMES} 10<sup>${tokens[ 1 ]}</sup> ${T}`;
  }
}

/**
 * Converts a fieldVector's angle in radians to a string in degrees.
 */
function radiansToDegreesString( fieldVector: Vector2 ): string {
  if ( fieldVector.magnitude === 0 ) {
    return '';
  }
  else {
    if ( fieldVector.angle === 0 ) {
      return `0${MathSymbols.DEGREES}`;
    }
    else {
      //TODO -angle to convert to +rotation counterclockwise, should be done in the model
      return `${Utils.toFixed( Utils.toDegrees( -fieldVector.angle ), ANGLE_DECIMAL_PLACES )}${MathSymbols.DEGREES}`;
    }
  }
}

faradaysElectromagneticLab.register( 'FieldMeterNode', FieldMeterNode );

