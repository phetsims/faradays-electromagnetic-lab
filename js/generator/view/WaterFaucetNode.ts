// Copyright 2024, University of Colorado Boulder

//TODO https://github.com/phetsims/scenery-phet/issues/840 When FaucetNode sound is completed, delete code identified by "TEMPORARY SOUND".
/**
 * WaterFaucetNode is the water faucet used to power the generator.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaucetNode, { FaucetNodeOptions } from '../../../../scenery-phet/js/FaucetNode.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { DragListener, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import WaterFaucet from '../model/WaterFaucet.js';
import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import Tandem from '../../../../tandem/js/Tandem.js';

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

    // TEMPORARY SOUND, like Slider.
    const soundGenerator = new ValueChangeSoundPlayer( waterFaucet.flowRateProperty.range );

    // TEMPORARY SOUND for keyboard drag. It's unclear why options.drag does not also apply to mouse/touch drag.
    let previousValue = waterFaucet.flowRateProperty.value;
    options.drag = event => {
      if ( event.isFromPDOM() ) {
        soundGenerator.playSoundForValueChange( waterFaucet.flowRateProperty.value, previousValue );
      }
      else {
        soundGenerator.playSoundIfThresholdReached( waterFaucet.flowRateProperty.value, previousValue );
      }
      previousValue = waterFaucet.flowRateProperty.value;
    };

    super( waterFaucet.flowRateProperty.range.max, waterFaucet.flowRateProperty, new Property( true ), options );

    // TEMPORARY SOUND mouse/touch drag. It's unclear why options.drag does not also handle this.
    this.addInputListener( new DragListener( {
      attach: false,
      drag: ( event, listener ) => options.drag( event ),
      tandem: Tandem.OPT_OUT
    } ) );
  }
}

faradaysElectromagneticLab.register( 'WaterFaucetNode', WaterFaucetNode );