// Copyright 2024, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaucetNode, { FaucetNodeOptions } from '../../../../scenery-phet/js/FaucetNode.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type WaterFaucetNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<FaucetNodeOptions, 'tandem'>;

export default class WaterFaucetNode extends FaucetNode {
  
  public constructor( speedProperty: NumberProperty, providedOptions: WaterFaucetNodeOptions ) {
    
    const options = optionize<WaterFaucetNodeOptions, SelfOptions, FaucetNodeOptions>()( {
      
      // FaucetNodeOptions
      scale: 0.7,
      closeOnRelease: false,
      tapToDispenseEnabled: false,
      horizontalPipeLength: 1800, // set empirically, for an extremely wide browser window
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );
    
    super( speedProperty.rangeProperty.value.max, speedProperty, new Property( true ), options );
  }
}

faradaysElectromagneticLab.register( 'WaterFaucetNode', WaterFaucetNode );