// Copyright 2023-2024, University of Colorado Boulder

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
import { KeyboardDragListenerOptions, RichTextOptions, Text, TextOptions, VBoxOptions } from '../../../scenery/js/imports.js';
import NumberControl, { NumberControlOptions } from '../../../scenery-phet/js/NumberControl.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import { RectangularRadioButtonOptions } from '../../../sun/js/buttons/RectangularRadioButton.js';
import { SoundClipOptions } from '../../../tambo/js/sound-generators/SoundClip.js';
import { SliderOptions } from '../../../sun/js/Slider.js';

// Credits are shared by all sims in this family.
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

const TITLE_FONT = new PhetFont( { size: 16, weight: 'bold' } );
const CONTROL_FONT = new PhetFont( 14 );
const TICK_LABEL_FONT = new PhetFont( 10 );

const CHECKBOX_OPTIONS: CheckboxOptions = {
  isDisposable: false,
  boxWidth: new Text( 'X', { font: CONTROL_FONT } ).height // Size the box to the height of a typical text label.
};

const CHECKBOX_TEXT_OPTIONS: TextOptions = {
  font: CONTROL_FONT,
  maxWidth: 165
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
    maxWidth: 120
  },
  sliderOptions: {
    trackSize: new Dimension2( 140, 4 ),
    thumbSize: new Dimension2( 15, 30 ),
    thumbTouchAreaXDilation: 5,
    thumbTouchAreaYDilation: 5,
    majorTickLength: 15
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

const TICK_LABEL_OPTIONS: RichTextOptions = {
  font: TICK_LABEL_FONT,
  maxWidth: 25
};

const PANEL_TITLE_OPTIONS: TextOptions = {
  font: TITLE_FONT,
  maxWidth: 200
};

const KEYBOARD_DRAG_LISTENER_OPTIONS: KeyboardDragListenerOptions = {
  dragVelocity: 300, // velocity of the Node being dragged, in view coordinates per second
  shiftDragVelocity: 20 // velocity with the Shift key pressed, typically slower than dragVelocity
};

const VBOX_OPTIONS: VBoxOptions = {
  spacing: 10,
  align: 'left',
  stretch: true
};

const RECTANGULAR_RADIO_BUTTON_OPTIONS: RectangularRadioButtonOptions = {
  baseColor: FELColors.radioButtonFillProperty,
  cornerRadius: 3,
  xMargin: 6,
  yMargin: 4,
  buttonAppearanceStrategyOptions: {
    selectedStroke: FELColors.radioButtonSelectedStrokeProperty,
    deselectedStroke: FELColors.radioButtonDeselectedStrokeProperty,
    deselectedLineWidth: 2,
    selectedLineWidth: 2
  }
};

const GRAB_RELEASE_SOUND_CLIP_OPTIONS: SoundClipOptions = {
  initialOutputLevel: 0.4
};

const PERCENT_SLIDER_OPTIONS: SliderOptions = {
  keyboardStep: 5,
  shiftKeyboardStep: 1,
  pageKeyboardStep: 10
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
  RECTANGULAR_RADIO_BUTTON_OPTIONS: RECTANGULAR_RADIO_BUTTON_OPTIONS,

  // Other options
  PANEL_TITLE_OPTIONS: PANEL_TITLE_OPTIONS,
  CHECKBOX_TEXT_OPTIONS: CHECKBOX_TEXT_OPTIONS,
  TICK_LABEL_OPTIONS: TICK_LABEL_OPTIONS,
  KEYBOARD_DRAG_LISTENER_OPTIONS: KEYBOARD_DRAG_LISTENER_OPTIONS,
  VBOX_OPTIONS: VBOX_OPTIONS,
  GRAB_RELEASE_SOUND_CLIP_OPTIONS: GRAB_RELEASE_SOUND_CLIP_OPTIONS,
  PERCENT_SLIDER_OPTIONS: PERCENT_SLIDER_OPTIONS,

  // Fonts
  TITLE_FONT: TITLE_FONT,
  CONTROL_FONT: CONTROL_FONT,
  TICK_LABEL_FONT: TICK_LABEL_FONT,

  // Preferences
  PREFERENCES_LABEL_FONT: new PhetFont( {
    size: 16,
    weight: 'bold'
  } ),
  PREFERENCES_LABEL_MAX_WIDTH: 200,
  PREFERENCES_DESCRIPTION_FONT: new PhetFont( 16 ),
  PREFERENCES_DESCRIPTION_LINE_WRAP: 500,

  // Model

  // Absolute current amplitude below this value is treated as zero.
  CURRENT_AMPLITUDE_THRESHOLD: 0.001
};

faradaysElectromagneticLab.register( 'FELConstants', FELConstants );
export default FELConstants;