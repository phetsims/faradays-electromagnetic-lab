// Copyright 2023, University of Colorado Boulder

//TODO add overline to 'B' magnitudes
//TODO when should we display '0' vs '0.00'?

/**
 * FieldMeterNode is the visual representation of a meter for measuring the B-field.
 * It can be dragged to a specific position, and shows the field vector's magnitude, x and y components, and angle.
 * The origin is at the center of the crosshairs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FieldMeter from '../model/FieldMeter.js';
import { GridBox, Node, Path, Rectangle, RichText, RichTextOptions } from '../../../../scenery/js/imports.js';
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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';

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
const READOUT_SIZE = new Dimension2( 90, 20 );
const READOUT_X_MARGIN = 5;
const READOUT_Y_MARGIN = 2;

const LABEL_TEXT_OPTIONS: RichTextOptions = {
  font: new PhetFont( 12 ),
  fill: FELColors.fieldMeterLabelsColorProperty,
  layoutOptions: {
    xAlign: 'left'
  }
};

const READOUT_TEXT_OPTIONS: RichTextOptions = {
  font: new PhetFont( 12 ),
  fill: FELColors.fieldMeterLabelsColorProperty,
  layoutOptions: {
    xAlign: 'left'
  },
  maxWidth: READOUT_SIZE.width - ( 2 * READOUT_X_MARGIN ),
  maxHeight: READOUT_SIZE.height - ( 2 * READOUT_Y_MARGIN )
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

    // Dynamic labels
    const stringBLabelProperty = new DerivedProperty( [ BStringProperty ], B => `${B}` );
    const stringBxLabelProperty = new DerivedProperty( [ BStringProperty, xStringProperty ], ( B, x ) => `${B}<sub>${x}</sub>` );
    const stringByLabelProperty = new DerivedProperty( [ BStringProperty, yStringProperty ], ( B, y ) => `${B}<sub>${y}</sub>` );

    // Dynamic values
    const stringBValueProperty = new DerivedProperty(
      [ FELPreferences.magneticUnitsProperty, fieldMeter.fieldVectorProperty, GStringProperty, TStringProperty ],
      ( magneticUnits, fieldVector, G, T ) =>
        ( magneticUnits === 'G' ) ? `${toGaussString( fieldVector.magnitude, G )}`
                                  : `${toTeslaString( fieldVector.magnitude, T )}`
    );
    const stringBxValueProperty = new DerivedProperty(
      [ FELPreferences.magneticUnitsProperty, fieldMeter.fieldVectorProperty, GStringProperty, TStringProperty ],
      ( magneticUnits, fieldVector, G, T ) =>
        ( magneticUnits === 'G' ) ? `${toGaussString( fieldVector.x, G )}`
                                  : `${toTeslaString( fieldVector.x, T )}`
    );
    const stringByValueProperty = new DerivedProperty(
      [ FELPreferences.magneticUnitsProperty, fieldMeter.fieldVectorProperty, GStringProperty, TStringProperty ],
      //TODO -fieldVector.y to convert to +y up, should be done in the model
      ( magneticUnits, fieldVector, G, T ) =>
        ( magneticUnits === 'G' ) ? `${toGaussString( -fieldVector.y, G )}`
                                  : `${toTeslaString( fieldVector.y, T )}`
    );
    const stringThetaValueProperty = new DerivedProperty(
      [ fieldMeter.fieldVectorProperty ],
      fieldVector => `${toDegreesString( fieldVector )}`
    );

    const gridBox = new GridBox( {
      xSpacing: 5,
      ySpacing: 5,
      yAlign: 'center',
      columns: [
        // Labels
        [
          new RichText( stringBLabelProperty, LABEL_TEXT_OPTIONS ),
          new RichText( stringBxLabelProperty, LABEL_TEXT_OPTIONS ),
          new RichText( stringByLabelProperty, LABEL_TEXT_OPTIONS ),
          new RichText( `${MathSymbols.THETA}`, LABEL_TEXT_OPTIONS )
        ],

        // Values
        [
          new StringDisplay( stringBValueProperty ),
          new StringDisplay( stringBxValueProperty ),
          new StringDisplay( stringByValueProperty ),
          new StringDisplay( stringThetaValueProperty )
        ]
      ]
    } );

    gridBox.boundsProperty.link( bounds => {
      gridBox.center = bodyNode.center;
    } );

    super( fieldMeter, {
      children: [ probeNode, crosshairsNode, bodyNode, gridBox ],
      visibleProperty: fieldMeter.visibleProperty,
      tandem: tandem
    } );
  }
}

/**
 * NumberDisplay has gotten way too complicated, and does not deal with dynamic strings well. Since they do not
 * be instrumented in this sim, roll our own lighter-weight implementation that works well with dynamic strings.
 */
class StringDisplay extends Node {

  public constructor( stringProperty: TReadOnlyProperty<string> ) {

    const background = new Rectangle( 0, 0, READOUT_SIZE.width, READOUT_SIZE.height, {
      fill: 'black',
      stroke: null,
      cornerRadius: 4
    } );

    const text = new RichText( stringProperty, READOUT_TEXT_OPTIONS );
    text.boundsProperty.link( bounds => {
      text.right = background.right - READOUT_X_MARGIN;
      text.centerY = background.centerY;
    } );

    super( {
      children: [ background, text ]
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
function toDegreesString( fieldVector: Vector2 ): string {
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

