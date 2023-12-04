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

  northColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'northColor', {
    default: 'red'
  } ),

  southColorProperty: new ProfileColorProperty( faradaysElectromagneticLab, 'southColor', {
    default: 'white',
    projector: Color.grayColor( 200 )
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
  } )
};

faradaysElectromagneticLab.register( 'FELColors', FELColors );
export default FELColors;