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
import { RichTextOptions, Text, TextOptions, VBoxOptions } from '../../../scenery/js/imports.js';
import NumberControl, { NumberControlOptions } from '../../../scenery-phet/js/NumberControl.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import { RectangularRadioButtonOptions } from '../../../sun/js/buttons/RectangularRadioButton.js';
import { SliderOptions } from '../../../sun/js/Slider.js';
import Tandem from '../../../tandem/js/Tandem.js';
import Range from '../../../dot/js/Range.js';
import { PreferencesControlOptions } from '../../../joist/js/preferences/PreferencesControl.js';

// Credits are shared by all sims in this family.
//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/2 fill in credits
const CREDITS: CreditsData = {
  leadDesign: 'Amy Rouinfar',
  softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
  team: 'Wendy Adams, Mike Dubson, Danielle Harlow, Ariel Paul, Archie Paulson, Kathy Perkins, Carl Wieman',
  contributors: '',
  qualityAssurance: '',
  graphicArts: '',
  soundDesign: '',
  thanks: ''
};

const TITLE_FONT = new PhetFont( { size: 16, weight: 'bold' } );
const CONTROL_FONT = new PhetFont( 14 );
const TICK_LABEL_FONT = new PhetFont( 10 );

const CHECKBOX_TEXT_OPTIONS: TextOptions = {
  font: CONTROL_FONT,
  maxWidth: 130
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
    maxWidth: 120,
    tandem: Tandem.OPT_OUT
  },
  sliderOptions: {
    trackSize: new Dimension2( 140, 4 ),
    thumbSize: new Dimension2( 15, 30 ),
    thumbTouchAreaXDilation: 5,
    thumbTouchAreaYDilation: 2,
    majorTickLength: 15,
    tandem: Tandem.OPT_OUT
  },
  numberDisplayOptions: {
    maxWidth: 100,
    textOptions: {
      font: CONTROL_FONT
    },
    tandem: Tandem.OPT_OUT
  },
  arrowButtonOptions: {
    tandem: Tandem.OPT_OUT
  }
};

const PANEL_OPTIONS: PanelOptions = {
  isDisposable: false,
  xMargin: 15,
  yMargin: 10,
  fill: FELColors.panelFillProperty,
  stroke: FELColors.panelStrokeProperty,
  visiblePropertyOptions: {
    phetioFeatured: true
  }
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

const VBOX_OPTIONS: VBoxOptions = {
  spacing: 10,
  align: 'left',
  stretch: true
};

const CHECKBOX_OPTIONS: CheckboxOptions = {
  isDisposable: false,
  boxWidth: new Text( 'X', { font: CONTROL_FONT } ).height, // Size the box to the height of a typical text label.

  // Use vertical space between checkboxes for pointer areas.
  mouseAreaXDilation: 5,
  mouseAreaYDilation: VBOX_OPTIONS.spacing! / 2,
  touchAreaXDilation: 5,
  touchAreaYDilation: VBOX_OPTIONS.spacing! / 2
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

const PERCENT_SLIDER_OPTIONS: SliderOptions = {
  keyboardStep: 5,
  shiftKeyboardStep: 1,
  pageKeyboardStep: 10
};

const PREFERENCES_CONTROL_OPTIONS: PreferencesControlOptions = {
  isDisposable: false,
  labelSpacing: 20,
  visiblePropertyOptions: {
    phetioFeatured: true
  }
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
  PREFERENCES_CONTROL_OPTIONS: PREFERENCES_CONTROL_OPTIONS,

  // Other options
  PANEL_TITLE_OPTIONS: PANEL_TITLE_OPTIONS,
  CHECKBOX_TEXT_OPTIONS: CHECKBOX_TEXT_OPTIONS,
  TICK_LABEL_OPTIONS: TICK_LABEL_OPTIONS,
  VBOX_OPTIONS: VBOX_OPTIONS,
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
  MAGNET_STRENGTH_RANGE: new Range( 0, 300 ), // G

  // Range of normalizedCurrentProperty. The magnitude determines the relative amount of current, while the sign
  // determines the current direction. See Coil.normalizedCurrentProperty.
  NORMALIZED_CURRENT_RANGE: new Range( -1, 1 ),

  // Absolute normalized current below this value is treated as zero.
  NORMALIZED_CURRENT_THRESHOLD: 0.001,

  // phetioDocumentation for all instances of normalizedCurrentProperty.
  NORMALIZED_CURRENT_PHET_IO_DOCUMENTATION:
    'For internal use only. Current in the coil is normalized to the range [-1,1]. ' +
    'The magnitude indicates the relative amount of current flowing in the coil, ' +
    'while the sign indicates the direction of flow.',

  // Diameter for charged particles (electrons and imaginary positive charges)
  CHARGED_PARTICLE_DIAMETER: 9
};

faradaysElectromagneticLab.register( 'FELConstants', FELConstants );
export default FELConstants;