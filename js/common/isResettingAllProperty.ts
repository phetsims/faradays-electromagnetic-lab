// Copyright 2023, University of Colorado Boulder

/**
 * isResettingAllProperty is a global Property that is true while a 'reset all' is in progress.
 * It is intended to be added to the ResetAllButton in a ScreenView like this:
 *
 * new ResetAllButton( {
 *   listener: () => {
 *     isResettingAllProperty.value = true;
 *     ... // Reset things here.
 *     isResettingAllProperty.value = false;
 *   }
 * } );
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import { BooleanProperty } from '../../../axon/js/imports.js';

const isResettingAllProperty = new BooleanProperty( false );

faradaysElectromagneticLab.register( 'isResettingAllProperty', isResettingAllProperty );

export default isResettingAllProperty;
