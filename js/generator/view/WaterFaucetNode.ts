// Copyright 2024, University of Colorado Boulder

/**
 * WaterFaucetNode is the water faucet used to power the generator.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaucetNode, { FaucetNodeOptions } from '../../../../scenery-phet/js/FaucetNode.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import WaterFaucet from '../model/WaterFaucet.js';

type SelfOptions = EmptySelfOptions;

type WaterFaucetNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<FaucetNodeOptions, 'tandem'>;

export default class WaterFaucetNode extends FaucetNode {

  public constructor( waterFaucet: WaterFaucet, providedOptions: WaterFaucetNodeOptions ) {

    const options = optionize<WaterFaucetNodeOptions, SelfOptions, FaucetNodeOptions>()( {

      // FaucetNodeOptions
      scale: 0.7,
      closeOnRelease: false,
      tapToDispenseEnabled: false,
      horizontalPipeLength: 1800, // set empirically, for an extremely wide browser window
      shooterOptions: {
        touchAreaXDilation: 15,
        touchAreaYDilation: 15
      },
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( waterFaucet.flowRateProperty.range.max, waterFaucet.flowRateProperty, new Property( true ), options );
  }
}

faradaysElectromagneticLab.register( 'WaterFaucetNode', WaterFaucetNode );