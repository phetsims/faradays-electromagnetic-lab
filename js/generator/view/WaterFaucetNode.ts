// Copyright 2024, University of Colorado Boulder

//TODO https://github.com/phetsims/scenery-phet/issues/840 When FaucetNode sound is completed, delete code identified by "TEMPORARY SOUND".
/**
 * WaterFaucetNode is the water faucet used to power the generator.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaucetNode, { FaucetNodeOptions } from '../../../../scenery-phet/js/FaucetNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { DragListener, NodeTranslationOptions, SceneryEvent } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import WaterFaucet from '../model/WaterFaucet.js';
import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Utils from '../../../../dot/js/Utils.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

const SOUND_STEP = 10; // %, play sound when flowRatePercentProperty changes by this much.

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

    // TEMPORARY SOUND: like Slider.
    const soundGenerator = new ValueChangeSoundPlayer( waterFaucet.flowRatePercentProperty.range, {
      numberOfMiddleThresholds: Utils.toFixedNumber( ( waterFaucet.flowRatePercentProperty.range.getLength() / SOUND_STEP ) - 1, 0 )
    } );

    // TEMPORARY SOUND: drag function shared by mouse/touch drag and keyboard drag.
    let previousValue = waterFaucet.flowRatePercentProperty.value;
    const dragSound = ( event: SceneryEvent ) => {
      if ( event.isFromPDOM() ) {
        soundGenerator.playSoundForValueChange( waterFaucet.flowRatePercentProperty.value, previousValue );
      }
      else {
        soundGenerator.playSoundIfThresholdReached( waterFaucet.flowRatePercentProperty.value, previousValue );
      }
      previousValue = waterFaucet.flowRatePercentProperty.value;
    };

    // TEMPORARY SOUND: for keyboard drag. It is unclear why this does not also address mouse/touch drag.
    options.drag = dragSound;

    // For PhET-iO. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/105
    const enabledProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'enabledProperty' ),
      phetioFeatured: true
    } );

    super( waterFaucet.flowRatePercentProperty.range.max, waterFaucet.flowRatePercentProperty, enabledProperty, options );

    // TEMPORARY SOUND: for mouse/touch drag.
    this.addInputListener( new DragListener( {
      attach: false,
      drag: dragSound,
      tandem: Tandem.OPT_OUT
    } ) );
  }
}

faradaysElectromagneticLab.register( 'WaterFaucetNode', WaterFaucetNode );