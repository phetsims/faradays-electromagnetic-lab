// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELKeyboardHelpContent is the keyboard help for most screens in the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';

export default class FELKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections = [

      // Move Draggable Items
      new MoveDraggableItemsKeyboardHelpSection(),

      // Slider Controls
      new SliderControlsKeyboardHelpSection()
    ];

    // Sections in the right column.
    const rightSections = [

      // Basic Actions
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( leftSections, rightSections, {
      isDisposable: false
    } );
  }
}

faradaysElectromagneticLab.register( 'FELKeyboardHelpContent', FELKeyboardHelpContent );