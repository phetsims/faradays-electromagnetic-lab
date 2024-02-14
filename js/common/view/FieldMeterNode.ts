// Copyright 2023-2024, University of Colorado Boulder

/**
 * FieldMeterNode is the visual representation of a meter for measuring the B-field.
 * It can be dragged to a specific position, and shows the field vector's magnitude, x and y components, and angle.
 * The origin is at the center of the crosshairs.
 *
 * This is based on FieldMeterGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FieldMeter from '../model/FieldMeter.js';
import { GridBox, Path, RichText, RichTextOptions } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import FELColors from '../FELColors.js';
import FELPreferences from '../model/FELPreferences.js';
import FELMovableNode, { FELMovableNodeOptions } from './FELMovableNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import StringDisplay, { StringDisplayOptions } from '../../../../scenery-phet/js/StringDisplay.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import FieldMeterSoundListener from './FieldMeterSoundListener.js';
import { TReadOnlyProperty } from '../../../../axon/js/imports.js';

const BStringProperty = FaradaysElectromagneticLabStrings.symbol.BStringProperty;
const xStringProperty = FaradaysElectromagneticLabStrings.symbol.xStringProperty;
const yStringProperty = FaradaysElectromagneticLabStrings.symbol.yStringProperty;
const GStringProperty = FaradaysElectromagneticLabStrings.units.GStringProperty;
const TStringProperty = FaradaysElectromagneticLabStrings.units.TStringProperty;
const valueUnitsStringProperty = FaradaysElectromagneticLabStrings.pattern.valueUnitsStringProperty;
const valueDegreesStringProperty = FaradaysElectromagneticLabStrings.pattern.valueDegreesStringProperty;

const G_DECIMAL_PLACES = 2;
const T_DECIMAL_PLACES = 2;
const ANGLE_DECIMAL_PLACES = 2;
const CROSSHAIRS_RADIUS = 10;
const PROBE_RADIUS = CROSSHAIRS_RADIUS + 8;
const BODY_X_MARGIN = 12;
const BODY_Y_MARGIN = 8;

const LABEL_TEXT_OPTIONS: RichTextOptions = {
  font: new PhetFont( 14 ),
  fill: FELColors.fieldMeterLabelsColorProperty,
  layoutOptions: {
    xAlign: 'left'
  },
  maxWidth: 16,
  maxHeight: 20 // RichText may be multiline
};

const STRING_DISPLAY_OPTIONS: StringDisplayOptions = {
  size: new Dimension2( 90, 22 ),
  xMargin: 5,
  yMargin: 2,
  richTextOptions: {
    font: new PhetFont( 14 ),
    fill: FELColors.fieldMeterLabelsColorProperty
  },
  rectangleOptions: {
    fill: FELColors.fieldMeterValuesBackgroundFillProperty,
    stroke: FELColors.fieldMeterValuesBackgroundStrokeProperty
  },
  layoutOptions: {
    xAlign: 'left'
  }
};

type SelfOptions = EmptySelfOptions;

type FieldMeterNodeOptions = SelfOptions & PickRequired<FELMovableNodeOptions, 'tandem' | 'dragBoundsProperty'>;

export default class FieldMeterNode extends FELMovableNode {

  private readonly fieldMeterSoundListener: FieldMeterSoundListener;

  public constructor( fieldMeter: FieldMeter, magnetStrengthRange: Range, fieldScaleProperty: TReadOnlyProperty<number>,
                      providedOptions: FieldMeterNodeOptions ) {

    const options = optionize<FieldMeterNodeOptions, SelfOptions, FELMovableNodeOptions>()( {

      // FELMovableNodeOptions
      visibleProperty: fieldMeter.visibleProperty
    }, providedOptions );

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

    // Dynamic labels. The Java version showed a line over 'B' for these labels, presumably indicating magnitude.
    // That notation was incorrect, since 'B' is (by definition) the *magnitude* of the magnetic field. See for
    // example https://en.wikipedia.org/wiki/Magnetic_flux.
    const stringBLabelProperty = new DerivedStringProperty( [ BStringProperty ], B => `${B}` );
    const stringBxLabelProperty = new DerivedStringProperty( [ BStringProperty, xStringProperty ], ( B, x ) => `${B}<sub>${x}</sub>` );
    const stringByLabelProperty = new DerivedStringProperty( [ BStringProperty, yStringProperty ], ( B, y ) => `${B}<sub>${y}</sub>` );

    // Dynamic values. We decided that Bx and By should be signed.
    const stringBValueProperty = new DerivedStringProperty(
      [ FELPreferences.magneticUnitsProperty, fieldMeter.fieldVectorProperty, GStringProperty, TStringProperty, valueUnitsStringProperty ],
      ( magneticUnits, fieldVector, G, T ) => {
        const B = fieldVector.magnitude;
        return ( magneticUnits === 'G' ) ? `${toGaussString( B, G )}` : `${toTeslaString( B, T )}`;
      }
    );
    const stringBxValueProperty = new DerivedStringProperty(
      [ FELPreferences.magneticUnitsProperty, fieldMeter.fieldVectorProperty, GStringProperty, TStringProperty, valueUnitsStringProperty ],
      ( magneticUnits, fieldVector, G, T ) => {
        const Bx = fieldVector.x;
        return ( magneticUnits === 'G' ) ? `${toGaussString( Bx, G )}` : `${toTeslaString( Bx, T )}`;
      }
    );
    const stringByValueProperty = new DerivedStringProperty(
      [ FELPreferences.magneticUnitsProperty, fieldMeter.fieldVectorProperty, GStringProperty, TStringProperty, valueUnitsStringProperty ],
      ( magneticUnits, fieldVector, G, T ) => {
        const By = -fieldVector.y;  // +y is down in the model, so flip the sign. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/19
        return ( magneticUnits === 'G' ) ? `${toGaussString( By, G )}`
                                         : `${toTeslaString( By, T )}`;
      }
    );
    const stringThetaValueProperty = new DerivedStringProperty(
      [ fieldMeter.fieldVectorProperty, valueDegreesStringProperty ],
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
          new StringDisplay( stringBValueProperty, STRING_DISPLAY_OPTIONS ),
          new StringDisplay( stringBxValueProperty, STRING_DISPLAY_OPTIONS ),
          new StringDisplay( stringByValueProperty, STRING_DISPLAY_OPTIONS ),
          new StringDisplay( stringThetaValueProperty, STRING_DISPLAY_OPTIONS )
        ]
      ]
    } );

    // Size the body to fit.
    const bodyNode = new ShadedRectangle( new Bounds2( 0, 0, gridBox.width + ( 2 * BODY_X_MARGIN ), gridBox.height + ( 2 * BODY_Y_MARGIN ) ), {
      cornerRadius: 10,
      baseColor: FELColors.fieldMeterBodyColorProperty,
      centerX: probeNode.centerX,
      top: probeNode.bottom - 2
    } );

    gridBox.boundsProperty.link( bounds => {
      gridBox.center = bodyNode.center;
    } );

    options.children = [ probeNode, crosshairsNode, bodyNode, gridBox ];

    super( fieldMeter, options );

    this.fieldMeterSoundListener = new FieldMeterSoundListener( fieldMeter.fieldVectorProperty, magnetStrengthRange,
      fieldScaleProperty );
    this.addInputListener( this.fieldMeterSoundListener );
  }
}

/**
 * Converts a numeric gauss value to a RichText string in gauss, in decimal notation.
 * If the value is exactly zero, display '0' with no decimal places.
 */
function toGaussString( gauss: number, G: string ): string {
  const stringValue = ( gauss === 0 ) ? '0' : Utils.toFixed( gauss, G_DECIMAL_PLACES );
  return StringUtils.fillIn( FaradaysElectromagneticLabStrings.pattern.valueUnitsStringProperty, {
    value: stringValue,
    units: G
  } );
}

/**
 * Converts a numeric gauss value to a RichText string in tesla, in *normalized* scientific notation (0 <= |mantissa| < 10).
 * If the value is exactly zero, display '0' with no decimal places.
 */
function toTeslaString( gauss: number, T: string ): string {
  let stringValue: string;
  if ( gauss === 0 ) {
    stringValue = '0';
  }
  else {
    const tesla = ( gauss / 10000 ).toExponential( T_DECIMAL_PLACES );
    const tokens = `${tesla}`.split( 'e' );
    assert && assert( tokens.length === 2, `unexpected tokens for ${tesla}` );
    stringValue = `${tokens[ 0 ]} ${MathSymbols.TIMES} 10<sup>${tokens[ 1 ]}</sup>`;
  }

  return StringUtils.fillIn( FaradaysElectromagneticLabStrings.pattern.valueUnitsStringProperty, {
    value: stringValue,
    units: T
  } );
}

/**
 * Converts a fieldVector's angle in radians to a string in degrees.
 * If the angle is exactly zero, display '0' with no decimal places.
 */
function toDegreesString( fieldVector: Vector2 ): string {
  if ( fieldVector.magnitude === 0 ) {
    return ''; // A zero-magnitude vector should display no value for its angle, since it points in no direction.
  }
  else {
    let stringValue: string;
    if ( fieldVector.angle === 0 ) {
      stringValue = '0';
    }
    else {
      // +angle is clockwise in the model, so flip the sign. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/19
      stringValue = `${Utils.toFixed( Utils.toDegrees( -fieldVector.angle ), ANGLE_DECIMAL_PLACES )}`;
    }
    return StringUtils.fillIn( FaradaysElectromagneticLabStrings.pattern.valueDegreesStringProperty, {
      value: stringValue
    } );
  }
}

faradaysElectromagneticLab.register( 'FieldMeterNode', FieldMeterNode );