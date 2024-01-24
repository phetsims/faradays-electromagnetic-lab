// Copyright 2024, University of Colorado Boulder

/**
 * FELPanels is the base class for the collection of panels for each screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type FELPanelsOptions = SelfOptions & PickRequired<VBoxOptions, 'children' | 'tandem'>;

export default class FELPanels extends VBox {

  protected constructor( providedOptions: FELPanelsOptions ) {
    super( optionize<FELPanelsOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      stretch: true,
      spacing: 5,
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions ) );
  }
}

faradaysElectromagneticLab.register( 'FELPanels', FELPanels );