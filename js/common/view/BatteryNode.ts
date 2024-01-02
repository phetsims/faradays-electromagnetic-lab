// Copyright 2023-2024, University of Colorado Boulder

/**
 * BatteryNode is the view of a DC battery, used to power the electromagnet. It has a slider for changing the battery
 * voltage and polarity, and displays the voltage value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Image, Node, Text } from '../../../../scenery/js/imports.js';
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

export default class BatteryNode extends Node {

  public constructor( battery: Battery, currentSourceProperty: TReadOnlyProperty<CurrentSource>, tandem: Tandem ) {

    //TODO Draw battery in code.
    const batteryImage = new Image( battery_png, {
      center: Vector2.ZERO
    } );

    //TODO Add bracket around batteryImage.

    const sliderStep = battery.amplitudeProperty.range.max / battery.maxVoltage;
    const slider = new HSlider( battery.amplitudeProperty, battery.amplitudeProperty.range, {
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
    slider.addMajorTick( battery.amplitudeProperty.range.min );
    slider.addMajorTick( 0 );
    slider.addMajorTick( battery.amplitudeProperty.range.max );

    const voltsStringProperty = new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valueUnitsStringProperty, {
      value: new DerivedProperty( [ battery.amplitudeProperty ], amplitude => Math.abs( amplitude * battery.maxVoltage ) ),
      units: FaradaysElectromagneticLabStrings.units.VStringProperty
    } );
    const voltsText = new Text( voltsStringProperty, {
      font: new PhetFont( 16 ),
      fill: FELColors.batteryVoltsColorProperty
    } );

    super( {
      children: [ batteryImage, slider, voltsText ],
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

faradaysElectromagneticLab.register( 'BatteryNode', BatteryNode );