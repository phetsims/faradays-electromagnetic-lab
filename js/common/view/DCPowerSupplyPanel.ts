// Copyright 2024, University of Colorado Boulder

/**
 * DCPowerSupplyPanel is a panel with controls for the DC power supply.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELConstants from '../FELConstants.js';
import DCPowerSupply from '../model/DCPowerSupply.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CurrentSource from '../model/CurrentSource.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import Slider from '../../../../sun/js/Slider.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import BatteryNode from './BatteryNode.js';

const SLIDER_STEP = 1;

export default class DCPowerSupplyPanel extends Panel {

  public constructor( dcPowerSupply: DCPowerSupply, currentSourceProperty: TReadOnlyProperty<CurrentSource>, tandem: Tandem ) {

    const voltageRange = dcPowerSupply.voltageProperty.range;

    const majorTickValues = [ voltageRange.min, 0, voltageRange.max ];
    const majorTicks = majorTickValues.map( majorTickValue => {
      return {
        value: majorTickValue,
        label: new Text( new PatternStringProperty( FaradaysElectromagneticLabStrings.pattern.valueUnitsStringProperty, {
          value: majorTickValue,
          units: FaradaysElectromagneticLabStrings.units.VStringProperty
        } ), FELConstants.TICK_LABEL_OPTIONS )
      };
    } );

    const batteryVoltageControl = new NumberControl( FaradaysElectromagneticLabStrings.batteryVoltageStringProperty,
      dcPowerSupply.voltageProperty, voltageRange,
      combineOptions<NumberControlOptions>( {}, FELConstants.NUMBER_CONTROL_OPTIONS, {
        layoutFunction: layoutFunction,
        titleNodeOptions: {
          font: FELConstants.CONTROL_FONT,
          maxWidth: 125
        },
        sliderOptions: {
          constrainValue: ( value: number ) => Utils.roundToInterval( value, SLIDER_STEP ),
          majorTicks: majorTicks,
          majorTickLength: 18,
          keyboardStep: 2,
          shiftKeyboardStep: 1,
          pageKeyboardStep: 5
        },
        numberDisplayOptions: {
          numberFormatter: voltage => StringUtils.fillIn( FaradaysElectromagneticLabStrings.pattern.valueUnitsStringProperty, {
            value: Utils.toFixed( voltage, 0 ),
            units: FaradaysElectromagneticLabStrings.units.VStringProperty
          } ),
          numberFormatterDependencies: [
            FaradaysElectromagneticLabStrings.pattern.valueUnitsStringProperty,
            FaradaysElectromagneticLabStrings.units.VStringProperty
          ]
        },
        tandem: tandem.createTandem( 'batteryVoltageControl' ),
        phetioVisiblePropertyInstrumented: false
      } ) );

    const titleIcon = DCPowerSupplyPanel.createIcon( 0.15 );

    const titleText = new Text( FaradaysElectromagneticLabStrings.dcPowerSupplyStringProperty, {
      font: new PhetFont( { size: 14, weight: 'bold' } ),
      maxWidth: 0.75 * batteryVoltageControl.width
    } );

    const titleNode = new HBox( {
      children: [ titleIcon, titleText ],
      spacing: 10
    } );

    const contentNode = new VBox( {
      children: [
        titleNode,
        batteryVoltageControl
      ],
      spacing: 8,
      align: 'center'
    } );

    super( contentNode, combineOptions<PanelOptions>( {}, FELConstants.PANEL_OPTIONS, {

      //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/163 Do clients need a way to hide this panel?
      visibleProperty: new DerivedProperty( [ currentSourceProperty ], currentSource => ( currentSource === dcPowerSupply ), {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      xMargin: 15,
      yMargin: 5,
      tandem: tandem,
      phetioFeatured: true
    } ) );

    // Interrupt interaction when this Node becomes invisible.
    this.visibleProperty.lazyLink( visible => !visible && this.interruptSubtreeInput() );

    this.addLinkedElement( dcPowerSupply );
  }

  /**
   * Creates an icon for the DC power supply.
   */
  public static createIcon( scale = 1 ): Node {
    return new BatteryNode( {
      scale: scale
    } );
  }
}

/**
 * Layout function for NumberDisplay.
 */
function layoutFunction( titleNode: Node, numberDisplay: NumberDisplay, slider: Slider, decrementButton: ArrowButton | null, incrementButton: ArrowButton | null ): Node {
  return new VBox( {
    align: 'left',
    spacing: 5,
    children: [
      new HBox( {
        children: [ titleNode, numberDisplay ],
        spacing: 5
      } ),
      slider
    ]
  } );
}

faradaysElectromagneticLab.register( 'DCPowerSupplyPanel', DCPowerSupplyPanel );