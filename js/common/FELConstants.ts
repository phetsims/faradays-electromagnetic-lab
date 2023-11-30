// Copyright 2023, University of Colorado Boulder

/**
 * FELConstants defines constants that are used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import { ScreenOptions } from '../../../joist/js/Screen.js';
import FELColors from './FELColors.js';
import { CreditsData } from '../../../joist/js/CreditsNode.js';
import { PanelOptions } from '../../../sun/js/Panel.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { CheckboxOptions } from '../../../sun/js/Checkbox.js';
import { KeyboardDragListenerOptions, Text } from '../../../scenery/js/imports.js';
import NumberControl, { NumberControlOptions } from '../../../scenery-phet/js/NumberControl.js';
import Dimension2 from '../../../dot/js/Dimension2.js';

//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/2 fill in credits
const CREDITS: CreditsData = {
  leadDesign: '',
  softwareDevelopment: '',
  team: '',
  contributors: '',
  qualityAssurance: '',
  graphicArts: '',
  soundDesign: '',
  thanks: ''
};

const CONTROL_FONT = new PhetFont( 14 );

const CHECKBOX_OPTIONS: CheckboxOptions = {
  isDisposable: false,
  boxWidth: new Text( 'X', { font: CONTROL_FONT } ).height // Size the box to the height of a typical text label.
};

const NUMBER_CONTROL_OPTIONS: NumberControlOptions = {
  isDisposable: false,
  layoutFunction: NumberControl.createLayoutFunction1( {
    align: 'left',
    arrowButtonsXSpacing: 5,
    ySpacing: 12
  } ),
  titleNodeOptions: {
    font: CONTROL_FONT,
    maxWidth: 140
  },
  sliderOptions: {
    trackSize: new Dimension2( 140, 4 ),
    thumbSize: new Dimension2( 15, 30 ),
    thumbTouchAreaXDilation: 5,
    thumbTouchAreaYDilation: 5
  },
  numberDisplayOptions: {
    maxWidth: 100,
    textOptions: {
      font: CONTROL_FONT
    }
  }
};

const PANEL_OPTIONS: PanelOptions = {
  isDisposable: false,
  xMargin: 15,
  yMargin: 10,
  fill: FELColors.panelFillProperty,
  stroke: FELColors.panelStrokeProperty
};

const SCREEN_OPTIONS: Partial<ScreenOptions> = {
  isDisposable: false,
  backgroundColorProperty: FELColors.screenBackgroundColorProperty,
  showUnselectedHomeScreenIconFrame: true
};

const KEYBOARD_DRAG_LISTENER_OPTIONS: KeyboardDragListenerOptions = {
  dragVelocity: 300, // velocity of the Node being dragged, in view coordinates per second
  shiftDragVelocity: 20 // velocity with the Shift key pressed, typically slower than dragVelocity
};

const FELConstants = {

  // Sim
  CREDITS: CREDITS,

  // Screen
  SCREEN_OPTIONS: SCREEN_OPTIONS,

  // ScreenView
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  // Options for various types of UI components
  CHECKBOX_OPTIONS: CHECKBOX_OPTIONS,
  NUMBER_CONTROL_OPTIONS: NUMBER_CONTROL_OPTIONS,
  PANEL_OPTIONS: PANEL_OPTIONS,

  // Other options
  KEYBOARD_DRAG_LISTENER_OPTIONS: KEYBOARD_DRAG_LISTENER_OPTIONS,

  // Fonts
  TITLE_FONT: new PhetFont( {
    size: 16,
    weight: 'bold'
  } ),
  CONTROL_FONT: CONTROL_FONT,
  TICK_LABEL_FONT: new PhetFont( 10 )
};

faradaysElectromagneticLab.register( 'FELConstants', FELConstants );
export default FELConstants;