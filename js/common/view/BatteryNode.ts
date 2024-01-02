// Copyright 2023-2024, University of Colorado Boulder

/**
 * BatteryNode is the view of a DC battery, used to power the electromagnet. It has a slider for changing the battery
 * voltage and polarity, and displays the voltage value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Image, Node, Path, Rectangle, Text } from '../../../../scenery/js/imports.js';
import batteryDCell_png from '../../../../scenery-phet/images/batteryDCell_png.js';
import Battery from '../model/Battery.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import battery_png from '../../../images/battery_png.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CurrentSource from '../model/CurrentSource.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import Utils from '../../../../dot/js/Utils.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import FELColors from '../FELColors.js';
import { Shape } from '../../../../kite/js/imports.js';

export default class BatteryNode extends Node {

  public constructor( battery: Battery, currentSourceProperty: TReadOnlyProperty<CurrentSource>, tandem: Tandem ) {

    //TODO Draw battery in code.
    const batteryImage = new Image( battery_png, {
      center: Vector2.ZERO
    } );

    // Bracket that holds the battery and connects it to the coil.
    const bracketNode = new BracketNode( batteryImage.width, batteryImage.height );
    bracketNode.centerX = batteryImage.centerX;
    bracketNode.top = batteryImage.top + 10;

    const sliderStep = battery.voltageProperty.range.max / battery.maxVoltage;
    const slider = new HSlider( battery.voltageProperty, battery.voltageProperty.range, {
      constrainValue: ( value: number ) => Utils.roundToInterval( value, sliderStep ),
      majorTickLength: 18,
      //TODO thumbFill, thumbFillHighlighted?
      //TODO alt input options
      // keyboardStep: ?,
      // shiftKeyboardStep: ?,
      // pageKeyboardStep: ?,
      centerX: batteryImage.centerX,
      bottom: batteryImage.bottom - 6,
      tandem: tandem.createTandem( 'slider' )
    } );
    slider.addMajorTick( battery.voltageProperty.range.min );
    slider.addMajorTick( 0 );
    slider.addMajorTick( battery.voltageProperty.range.max );

    // Volts display, absolute value
    const voltsStringProperty = new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valueUnitsStringProperty, {
      value: new DerivedProperty( [ battery.voltageProperty ], voltage => Math.abs( voltage ) ),
      units: FaradaysElectromagneticLabStrings.units.VStringProperty
    } );
    const voltsText = new Text( voltsStringProperty, {
      font: new PhetFont( 16 ),
      fill: FELColors.batteryVoltsColorProperty
    } );

    super( {
      children: [ bracketNode, batteryImage, slider, voltsText ],
      visibleProperty: new DerivedProperty( [ currentSourceProperty ], currentSource => ( currentSource === battery ), {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      tandem: tandem
    } );

    this.addLinkedElement( battery );

    // Reflect the battery about the y-axis to change its polarity.
    battery.amplitudeProperty.link( ( amplitude, previousAmplitude ) => {
      if ( amplitude >= 0 && ( previousAmplitude === null || previousAmplitude < 0 ) ) {
        batteryImage.matrix = Matrix3.IDENTITY;
        batteryImage.center = Vector2.ZERO;
      }
      else if ( amplitude < 0 && ( previousAmplitude === null || previousAmplitude >= 0 ) ) {
        batteryImage.matrix = Matrix3.X_REFLECTION;
        batteryImage.center = Vector2.ZERO;
      }
    } );

    // Position the volts value at the correct end of the battery.
    Multilink.multilink(
      [ battery.amplitudeProperty, voltsText.boundsProperty ],
      ( amplitude, bounds ) => {
        const xMargin = 15;
        if ( amplitude >= 0 ) {
          voltsText.right = batteryImage.right - xMargin;
        }
        else {
          voltsText.left = batteryImage.left + xMargin;
        }
        voltsText.centerY = batteryImage.top + ( slider.top - batteryImage.top ) / 2;
      } );
  }

  public static createIcon( scale = 0.5 ): Node {
    return new Image( batteryDCell_png, {
      scale: scale
    } );
  }
}

/**
 * BracketNode is the bracket that holds the battery and connects it to the coil.
 */
class BracketNode extends Node {

  public constructor( batteryWidth: number, batteryHeight: number ) {

    const bracketThickness = 8;
    const gapWidth = 4; // gap between the 2 sections of the bracket
    const contactWidth = 12;
    const contactHeight = 40;

    const width = batteryWidth + bracketThickness + contactWidth;
    const bracketShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( 0, batteryHeight )
      .lineTo( ( 0.5 * width ) - gapWidth, batteryHeight )
      .moveTo( ( 0.5 * width ) + gapWidth, batteryHeight )
      .lineTo( width, batteryHeight )
      .lineTo( width, 0 );

    const bracketPath = new Path( bracketShape, {
      stroke: FELColors.batteryBracketColorProperty,
      lineWidth: bracketThickness
    } );

    const contactCornerRadius = 5;

    const leftContact = new Rectangle( 0, 0, contactWidth, contactHeight, {
      cornerRadius: contactCornerRadius,
      fill: FELColors.batteryContactColorProperty,
      centerX: bracketPath.left + bracketThickness,
      top: bracketPath.top + 11 // empirically lined up with the battery's positive terminal
    } );

    const rightContact = new Rectangle( 0, 0, contactWidth, contactHeight, {
      cornerRadius: contactCornerRadius,
      fill: FELColors.batteryContactColorProperty,
      centerX: bracketPath.right - bracketThickness,
      top: leftContact.top
    } );

    super( {
      children: [ leftContact, rightContact, bracketPath ]
    } );
  }
}

faradaysElectromagneticLab.register( 'BatteryNode', BatteryNode );