// Copyright 2023, University of Colorado Boulder

/**
 * ElectromagnetKeyboardHelpContent is the keyboard help for the 'Electromagnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

export default class ElectromagnetKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections: KeyboardHelpSection[] = [
      //TODO add help sections that are relevant to this screen
    ];

    // Sections in the right column.
    const rightSections = [

      //TODO add help sections that are relevant to this screen

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

faradaysElectromagneticLab.register( 'ElectromagnetKeyboardHelpContent', ElectromagnetKeyboardHelpContent );