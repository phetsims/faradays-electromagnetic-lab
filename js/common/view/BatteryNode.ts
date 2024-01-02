// Copyright 2023-2024, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
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
import StringDisplay from './StringDisplay.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

const VOLTAGE_DISPLAY_SIZE = new Dimension2( 100, 50 );
const FONT = new PhetFont( 16 );

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

    const voltageStringProperty = new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valueUnitsStringProperty, {
      value: new DerivedProperty( [ battery.amplitudeProperty ], amplitude => Math.abs( amplitude * battery.maxVoltage ) ),
      units: FaradaysElectromagneticLabStrings.units.VStringProperty
    } );
    const voltageDisplay = new StringDisplay( voltageStringProperty, {
      size: VOLTAGE_DISPLAY_SIZE,
      xMargin: 0,
      yMargin: 0,
      rectangleOptions: {
        fill: null,
        stroke: null
      },
      textOptions: {
        font: FONT,
        fill: 'red' //TODO color profile
      }
    } );

    super( {
      children: [ batteryImage, slider, voltageDisplay ],
      visibleProperty: new DerivedProperty( [ currentSourceProperty ], currentSource => ( currentSource === battery ), {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      tandem: tandem
    } );

    // Reflect the battery about the y-axis to change its polarity.
    //TODO JO This is not behaving as expected.
    battery.amplitudeProperty.link( amplitude => {
      batteryImage.matrix.setToIdentity();
      const xScale = ( amplitude >= 0 ) ? 1 : -1; // Sign of the amplitude determines the polarity of the battery.
      batteryImage.setScaleMagnitude( xScale, 1 );
      batteryImage.center = Vector2.ZERO;
    } );

    //TODO Position of voltageDisplay is not as expected.
    Multilink.multilink(
      [ battery.amplitudeProperty, voltageDisplay.boundsProperty ],
      ( amplitude, bounds ) => {
        const xOffset = 10; //TODO
        if ( amplitude >= 0 ) {
          voltageDisplay.right = batteryImage.right - xOffset;
        }
        else {
          voltageDisplay.left = batteryImage.left + xOffset;
        }
        voltageDisplay.bottom = slider.top - 5;
      } );
  }

  public static createIcon( scale = 0.5 ): Node {
    return new Image( batteryDCell_png, {
      scale: scale
    } );
  }
}

faradaysElectromagneticLab.register( 'BatteryNode', BatteryNode );