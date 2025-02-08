// Copyright 2024-2025, University of Colorado Boulder

/**
 * DCPowerSupplyPanel is a panel with controls for the DC power supply.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';
import Slider from '../../../../sun/js/Slider.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELColors from '../FELColors.js';
import FELConstants from '../FELConstants.js';
import CurrentSource from '../model/CurrentSource.js';
import DCPowerSupply from '../model/DCPowerSupply.js';
import BatteryNode from './BatteryNode.js';
import PowerSupplyPanel, { PowerSupplyPanelOptions } from './PowerSupplyPanel.js';

const SLIDER_STEP = 1;

type SelfOptions = EmptySelfOptions;

type DCPowerSupplyPanelOptions = SelfOptions & PickRequired<PowerSupplyPanelOptions, 'position' | 'tandem'>;

export default class DCPowerSupplyPanel extends PowerSupplyPanel {

  public constructor( dcPowerSupply: DCPowerSupply,
                      currentSourceProperty: TReadOnlyProperty<CurrentSource>,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      rightPanelsBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions: DCPowerSupplyPanelOptions ) {

    const options = optionize<DCPowerSupplyPanelOptions, SelfOptions, PowerSupplyPanelOptions>()( {

      // PowerSupplyPanelOptions
      fill: FELColors.dcPowerSupplyPanelFillProperty,
      stroke: FELColors.dcPowerSupplyPanelStrokeProperty
    }, providedOptions );

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
        tandem: options.tandem.createTandem( 'batteryVoltageControl' ),
        phetioVisiblePropertyInstrumented: false
      } ) );

    const titleIcon = DCPowerSupplyPanel.createIcon( 0.15 );

    const titleText = new Text( FaradaysElectromagneticLabStrings.dcPowerSupplyStringProperty, {
      font: new PhetFont( { size: 14, weight: 'bold' } ),
      maxWidth: 0.75 * batteryVoltageControl.width
    } );

    const titleNode = new HBox( {
      children: [ titleText, titleIcon ],
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

    super( contentNode, dcPowerSupply, currentSourceProperty, visibleBoundsProperty, rightPanelsBoundsProperty, options );
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
    align: 'center',
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