// Copyright 2023-2024, University of Colorado Boulder

/**
 * DCPowerSupplyNode is the view of a DC power supply, used to power the electromagnet. It has a slider for changing
 * a battery's voltage and polarity, and displays the voltage value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Node, Path, Rectangle, Text } from '../../../../scenery/js/imports.js';
import DCPowerSupply from '../model/DCPowerSupply.js';
import Tandem from '../../../../tandem/js/Tandem.js';
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
import BatteryNode from './BatteryNode.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';

export default class DCPowerSupplyNode extends Node {

  public constructor( dcPowerSupply: DCPowerSupply, currentSourceProperty: TReadOnlyProperty<CurrentSource>, tandem: Tandem ) {

    const batteryNode = new BatteryNode( {
      center: Vector2.ZERO
    } );

    // Bracket that holds the battery and connects it to the coil.
    const bracketNode = new BracketNode( batteryNode.width, batteryNode.height );
    bracketNode.centerX = batteryNode.centerX;
    bracketNode.top = batteryNode.top + 10;

    const voltageSlider = new HSlider( dcPowerSupply.voltageProperty, dcPowerSupply.voltageProperty.range, {
      constrainValue: ( value: number ) => Utils.roundToInterval( value, 1 ), // 1 V steps
      majorTickLength: 18,
      keyboardStep: 2,
      shiftKeyboardStep: 1,
      pageKeyboardStep: 5,
      centerX: batteryNode.centerX,
      bottom: batteryNode.bottom - 6,
      tandem: tandem.createTandem( 'voltageSlider' )
    } );
    voltageSlider.addMajorTick( dcPowerSupply.voltageProperty.range.min );
    voltageSlider.addMajorTick( 0 );
    voltageSlider.addMajorTick( dcPowerSupply.voltageProperty.range.max );

    // Volts display, absolute value
    const voltsStringProperty = new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valueUnitsStringProperty, {
      value: new DerivedStringProperty( [ dcPowerSupply.voltageProperty ], voltage => `${Math.abs( voltage )}` ),
      units: FaradaysElectromagneticLabStrings.units.VStringProperty
    } );
    const voltsText = new Text( voltsStringProperty, {
      font: new PhetFont( 16 ),
      fill: FELColors.batteryVoltsColorProperty
    } );

    super( {
      children: [ bracketNode, batteryNode, voltageSlider, voltsText ],
      visibleProperty: new DerivedProperty( [ currentSourceProperty ], currentSource => ( currentSource === dcPowerSupply ), {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      tandem: tandem,
      phetioFeatured: true
    } );

    this.addLinkedElement( dcPowerSupply );

    // Interrupt interaction when this Node becomes invisible.
    this.visibleProperty.lazyLink( visible => !visible && this.interruptSubtreeInput() );

    // Reflect the battery about the y-axis to change its polarity.
    dcPowerSupply.currentAmplitudeProperty.link( ( amplitude, previousAmplitude ) => {
      if ( amplitude >= 0 && ( previousAmplitude === null || previousAmplitude < 0 ) ) {
        batteryNode.matrix = Matrix3.IDENTITY;
        batteryNode.center = Vector2.ZERO;
      }
      else if ( amplitude < 0 && ( previousAmplitude === null || previousAmplitude >= 0 ) ) {
        batteryNode.matrix = Matrix3.X_REFLECTION;
        batteryNode.center = Vector2.ZERO;
      }
    } );

    // Position the volts value at the correct end of the battery.
    Multilink.multilink(
      [ dcPowerSupply.currentAmplitudeProperty, voltsText.boundsProperty ],
      ( amplitude, bounds ) => {
        const xMargin = 15;
        if ( amplitude >= 0 ) {
          voltsText.right = batteryNode.right - xMargin;
        }
        else {
          voltsText.left = batteryNode.left + xMargin;
        }
        voltsText.centerY = batteryNode.top + ( voltageSlider.top - batteryNode.top ) / 2;
      } );
  }

  public static createIcon( scale = 1 ): Node {
    return new BatteryNode( {
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

faradaysElectromagneticLab.register( 'DCPowerSupplyNode', DCPowerSupplyNode );