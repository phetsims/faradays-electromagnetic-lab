// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELColors defines colors that are used throughout this sim.
 *
 * For static colors that are used in more than one place, add them here.
 *
 * For dynamic colors that can be controlled via colorProfileProperty.js, add instances of ProfileColorProperty here,
 * each of which is required to have a default color. Note that dynamic colors can be edited by running the sim from
 * phetmarks using the "Color Edit" mode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';

const PANEL_FILL_PROJECTOR = new Color( 222, 234, 255 );
const BAR_MAGNET_NORTH_COLOR = 'rgb( 219, 30, 34 )';
const BAR_MAGNET_SOUTH_COLOR = 'rgb( 48, 69, 138 )';

const FELColors = {

  // Background color for screens in this sim
  screenBackgroundColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'background', {
    default: 'black',
    projector: 'white'
  } ),

  panelFillProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'panelFill', {
    default: PANEL_FILL_PROJECTOR,
    projector: PANEL_FILL_PROJECTOR
  } ),

  panelStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'panelStroke', {
    default: PANEL_FILL_PROJECTOR.darkerColor( 0.85 ),
    projector: PANEL_FILL_PROJECTOR.darkerColor( 0.85 )
  } ),

  acPowerSupplyPanelFillProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'acPowerSupplyPanelFill', {
    default: PANEL_FILL_PROJECTOR,
    projector: PANEL_FILL_PROJECTOR
  } ),

  acPowerSupplyPanelStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'acPowerSupplyPanelStroke', {
    default: PANEL_FILL_PROJECTOR.darkerColor( 0.85 ),
    projector: PANEL_FILL_PROJECTOR.darkerColor( 0.85 )
  } ),

  dcPowerSupplyPanelFillProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'dcPowerSupplyPanelFill', {
    default: PANEL_FILL_PROJECTOR,
    projector: PANEL_FILL_PROJECTOR
  } ),

  dcPowerSupplyPanelStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'dcPowerSupplyPanelStroke', {
    default: PANEL_FILL_PROJECTOR.darkerColor( 0.85 ),
    projector: PANEL_FILL_PROJECTOR.darkerColor( 0.85 )
  } ),

  barMagnetNorthColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'barMagnetNorthColor', {
    default: BAR_MAGNET_NORTH_COLOR
  } ),

  barMagnetSouthColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'barMagnetSouthColor', {
    default: BAR_MAGNET_SOUTH_COLOR
  } ),

  barMagnetNorthTextColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'barMagnetNorthTextColor', {
    default: 'white'
  } ),

  barMagnetSouthTextColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'barMagnetSouthTextColor', {
    default: 'white'
  } ),

  fieldMeterBodyColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'fieldMeterBodyColor', {
    default: 'rgb( 17, 33, 255 )'
  } ),

  fieldMeterProbeColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'fieldMeterProbeColor', {
    default: 'rgb( 17, 33, 255 )'
  } ),

  fieldMeterCrosshairsColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'fieldMeterCrosshairsColor', {
    default: 'white',
    projector: 'black'
  } ),

  fieldMeterLabelsColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'fieldMeterLabelsColor', {
    default: 'white'
  } ),

  fieldMeterValuesColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'fieldMeterValuesColor', {
    default: 'white'
  } ),

  fieldMeterValuesBackgroundFillProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'fieldMeterValuesBackgroundFill', {
    default: 'black'
  } ),

  fieldMeterValuesBackgroundStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'fieldMeterValuesBackgroundStroke', {
    default: 'transparent'
  } ),

  fieldInsideStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'fieldInsideStroke', {
    default: 'black'
  } ),

  compassNeedleNorthColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'compassNeedleNorthColor', {
    default: BAR_MAGNET_NORTH_COLOR
  } ),

  compassNeedleSouthColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'compassNeedleSouthColor', {
    default: 'white'
  } ),

  compassNeedleStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'compassNeedleStroke', {
    default: 'black'
  } ),

  compassRingColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'compassRingColor', {
    default: Color.grayColor( 153 )
  } ),

  compassIndicatorsColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'compassIndicatorsColor', {
    default: 'black'
  } ),

  compassNeedleAnchorColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'compassNeedleAnchorColor', {
    default: 'black'
  } ),

  radioButtonFillProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'radioButtonFill', {
    default: 'white'
  } ),

  radioButtonSelectedStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'radioButtonSelectedStroke', {
    default: 'rgb( 0, 0, 0 )'
  } ),

  radioButtonDeselectedStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'radioButtonDeselectedStroke', {
    default: 'grey'
  } ),

  electronColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'electronColor', {
    default: 'rgb( 64, 61, 255 )'
  } ),

  electronMinusColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'electronMinusColor', {
    default: 'white'
  } ),

  positiveChargeColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'positiveChargeColor', {
    default: 'red'
  } ),

  positiveChargePlusColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'positiveChargePlusColor', {
    default: 'white'
  } ),

  coilFrontColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'coilFrontColor', {
    default: 'rgb( 191, 128, 64 )'
  } ),

  coilMiddleColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'coilMiddleColor', {
    default: 'rgb( 134, 88, 45 )'
  } ),

  coilBackColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'coilBackColor', {
    default: 'rgb( 57, 38, 19 )'
  } ),

  pickupCoilAxisStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'pickupCoilAxisStroke', {
    default: PhetColorScheme.RED_COLORBLIND
  } ),

  lightBulbBaseColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'lightBulbBaseColor', {
    default: Color.grayColor( 153 )
  } ),

  lightBulbSocketColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'lightBulbSocketColor', {
    default: Color.grayColor( 200 )
  } ),

  lightRaysColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'lightRaysColor', {
    default: 'yellow'
  } ),

  voltageLabelColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'voltageLabelColor', {
    default: 'white'
  } ),

  voltmeterBodyColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'voltmeterBodyColor', {
    default: 'rgb( 13, 0, 160 )'
  } ),

  voltmeterDisplayColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'voltmeterDisplayColor', {
    default: 'rgb( 255, 255, 213 )'
  } ),

  voltmeterNeedleColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'voltmeterNeedleColor', {
    default: 'blue'
  } ),

  voltmeterGaugeColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'voltmeterGaugeColor', {
    default: 'black'
  } ),

  voltMeterPositiveProbeFillProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'voltMeterPositiveProbeFill', {
    default: 'white'
  } ),

  voltmeterPositiveProbeStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'voltmeterPositiveProbeStroke', {
    default: 'white',
    projector: 'black'
  } ),

  voltmeterNegativeProbeFillProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'voltMeterNegativeProbeFill', {
    default: Color.grayColor( 110 )
  } ),

  voltmeterNegativeProbeStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'voltmeterProbeStroke', {
    default: Color.grayColor( 110 ),
    projector: 'black'
  } ),

  voltmeterWireFillProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'voltmeterWireFill', {
    default: Color.grayColor( 153 )
  } ),

  voltmeterWireStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'voltmeterWireStroke', {
    default: Color.grayColor( 153 ),
    projector: 'black'
  } ),

  // For design of resistor colors, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/29#issuecomment-1890128720
  resistorFillProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'resistorFill', {
    default: 'rgb( 195, 136, 89 )'
  } ),

  resistorStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'resistorStroke', {
    default: 'black'
  } ),

  resistorBand1ColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'resistorBand1Color', {
    default: 'black'
  } ),

  resistorBand2ColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'resistorBand2Color', {
    default: 'rgb( 150, 75, 1 )'
  } ),

  resistorBand3ColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'resistorBand3Color', {
    default: 'rgb( 230, 182, 1 )'
  } ),

  resistorBand4ColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'resistorBand4Color', {
    default: 'rgb( 230, 182, 1 )'
  } ),

  rpmDisplayCenterColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'rpmDisplayCenterColor', {
    default: 'black'
  } ),

  rpmDisplayRingColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'rpmDisplayRingColor', {
    default: Color.grayColor( 150 )
  } ),

  rpmDisplayTextColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'rpmDisplayTextColor', {
    default: 'white'
  } ),

  acPowerSupplyBodyColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'acPowerSupplyBodyColor', {
    default: Color.grayColor( 200 )
  } ),

  acPowerSupplyChartProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'acPowerSupplyDisplayColor', {
    default: 'black'
  } ),

  acPowerSupplyWaveColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'acPowerSupplyWaveColor', {
    default: 'rgb( 0, 255, 0 )'
  } ),

  acPowerSupplyAxesColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'acPowerSupplyAxesColor', {
    default: 'rgba( 255, 255, 255, 0.7 )'
  } ),

  acPowerSupplyCursorColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'acPowerSupplyCursorColor', {
    default: 'red'
  } ),

  waterColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'waterColor', {
    default: 'rgba( 194, 234, 255, 0.7 )'
  } ),

  batteryVoltsColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'batteryVoltsColor', {
    default: 'black'
  } ),

  batteryBracketColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'batteryBracketColor', {
    default: Color.grayColor( 172 )
  } ),

  batteryContactColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'batteryContactColor', {
    default: Color.grayColor( 108 )
  } )
};

faradaysElectromagneticLab.register( 'FELColors', FELColors );
export default FELColors;