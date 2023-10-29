// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetKeyboardHelpContent is the keyboard help for the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

export default class BarMagnetKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections: KeyboardHelpSection[] = [
      //TODO
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

faradaysElectromagneticLab.register( 'BarMagnetKeyboardHelpContent', BarMagnetKeyboardHelpContent );