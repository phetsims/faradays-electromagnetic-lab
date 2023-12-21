// Copyright 2023, University of Colorado Boulder

/**
 * FELColors defines colors that are used throughout this sim.
 *
 * All simulations should have a Colors.js file, see https://github.com/phetsims/scenery-phet/issues/642.
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

  barMagnetNorthColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'barMagnetNorthColor', {
    default: 'rgb( 219, 30, 34 )'
  } ),

  barMagnetSouthColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'barMagnetSouthColor', {
    default: 'rgb( 48, 69, 138 )'
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
    default: 'red'
  } ),

  compassNeedleSouthColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'compassNeedleSouthColor', {
    default: 'white',
    projector: Color.grayColor( 200 )
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
    default: 'rgb( 153, 206, 255 )'
  } ),

  radioButtonSelectedStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'radioButtonSelectedStroke', {
    default: PhetColorScheme.RED_COLORBLIND
  } ),

  radioButtonDeselectedStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'radioButtonDeselectedStroke', {
    default: 'grey'
  } ),

  electronColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'electronColor', {
    default: 'blue'
  } ),

  coilFrontColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'coilFrontColor', {
    default: 'rgb( 153, 102, 51 )' // light brown
  } ),

  coilMiddleColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'coilMiddleColor', {
    default: 'rgb( 92, 52, 12 )' // dark brown
  } ),

  coilBackColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'coilBackColor', {
    default: 'rgb( 40, 23, 3 )' // darker brown
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

  voltageLabelColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'voltageLabelColor', {
    default: 'white'
  } ),

  positiveProbeFillProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'positiveProbeFill', {
    default: 'white'
  } ),

  negativeProbeFillProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'negativeProbeFill', {
    default: 'gray'
  } ),

  resistorFillProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'resistorFill', {
    default: 'rgb( 210, 168, 84 )' //rgb( 200, 176, 135 )'
  } ),

  resistorStrokeProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'resistorStroke', {
    default: 'black'
  } ),

  resistorBand1ColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'resistorBand1Color', {
    default: 'black'
  } ),

  resistorBand2ColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'resistorBand2Color', {
    default: 'black'
  } ),

  resistorBand3ColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'resistorBand3Color', {
    default: 'black'
  } ),

  resistorBand4ColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'resistorBand4Color', {
    default: 'rgb( 153, 112, 19 )' // gold
  } )
};

faradaysElectromagneticLab.register( 'FELColors', FELColors );
export default FELColors;