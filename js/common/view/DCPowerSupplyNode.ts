// Copyright 2023-2024, University of Colorado Boulder

/**
 * DCPowerSupplyNode is the view of the DC power supply attached to the electromagnet. A battery is held in
 * a bracket that is connected to the electromagnet's coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Node, NodeOptions, NodeTranslationOptions, Path, Rectangle, Text } from '../../../../scenery/js/imports.js';
import DCPowerSupply from '../model/DCPowerSupply.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import FELColors from '../FELColors.js';
import { Shape } from '../../../../kite/js/imports.js';
import BatteryNode from './BatteryNode.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type DCPowerSupplyNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class DCPowerSupplyNode extends Node {

  public constructor( dcPowerSupply: DCPowerSupply, providedOptions: DCPowerSupplyNodeOptions ) {

    const batteryNode = new BatteryNode( {
      size: new Dimension2( 100, 45 ),
      center: Vector2.ZERO
    } );

    // Bracket that holds the battery and connects it to the coil.
    const bracketNode = new BracketNode( batteryNode.width, batteryNode.height );
    bracketNode.centerX = batteryNode.centerX;
    bracketNode.top = batteryNode.top + 10;

    // Volts display, absolute value
    const voltsStringProperty = new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valueUnitsStringProperty, {
      value: new DerivedStringProperty( [ dcPowerSupply.voltageProperty ], voltage => `${Math.abs( voltage )}` ),
      units: FaradaysElectromagneticLabStrings.units.VStringProperty
    } );
    const voltsText = new Text( voltsStringProperty, {
      font: new PhetFont( 12 ),
      fill: FELColors.batteryVoltsColorProperty,
      maxWidth: 40,
      tandem: providedOptions.tandem.createTandem( 'voltsText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    const options = optionize<DCPowerSupplyNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      children: [ bracketNode, batteryNode, voltsText ]
    }, providedOptions );

    super( options );

    this.addLinkedElement( dcPowerSupply );

    // Interrupt interaction when this Node becomes invisible.
    this.visibleProperty.lazyLink( visible => !visible && this.interruptSubtreeInput() );

    // Reflect the battery about the y-axis to change its polarity.
    dcPowerSupply.normalizedCurrentProperty.link( ( normalizedCurrent, previousNormalizedCurrent ) => {
      if ( normalizedCurrent >= 0 && ( previousNormalizedCurrent === null || previousNormalizedCurrent < 0 ) ) {
        batteryNode.matrix = Matrix3.IDENTITY;
        batteryNode.center = Vector2.ZERO;
      }
      else if ( normalizedCurrent < 0 && ( previousNormalizedCurrent === null || previousNormalizedCurrent >= 0 ) ) {
        batteryNode.matrix = Matrix3.X_REFLECTION;
        batteryNode.center = Vector2.ZERO;
      }
    } );

    // Position the volts value at the positive pole of the battery. Offsets set empirically.
    Multilink.multilink(
      [ dcPowerSupply.normalizedCurrentProperty, voltsText.boundsProperty ],
      ( normalizedCurrent, voltsTextBounds ) => {
        if ( normalizedCurrent >= 0 ) {
          voltsText.right = batteryNode.right - 10;
        }
        else {
          voltsText.right = batteryNode.left + 35;
        }
        voltsText.centerY = batteryNode.centerY;
      } );
  }
}

/**
 * BracketNode is the bracket that holds the battery and connects it to the coil.
 */
class BracketNode extends Node {

  public constructor( batteryWidth: number, batteryHeight: number ) {

    const bracketThickness = 6;
    const gapWidth = 4; // gap between the 2 sections of the bracket
    const contactWidth = 8;
    const contactHeight = 20;

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
      top: bracketPath.top + 3 // empirically lined up with the battery's positive terminal
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