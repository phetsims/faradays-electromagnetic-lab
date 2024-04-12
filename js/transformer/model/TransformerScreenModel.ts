// Copyright 2023-2024, University of Colorado Boulder

/**
 * TransformerScreenModel is the top-level model for the 'Transformer' screen.
 *
 * Note that this class name differs from the PhET convention of {ScreenName}Model to avoid confusion between
 * the Transformer screen and the Transformer model element.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IncrementalCompass from '../../common/model/IncrementalCompass.js';
import FELScreenModel from '../../common/model/FELScreenModel.js';
import Transformer from './Transformer.js';
import FELPreferences from '../../common/model/FELPreferences.js';

// y position shared by all components, so that they are on the same horizontal axis.
const Y_POSITION = 375;

// Positions are factored out here because we've changed them so many times.
const ELECTROMAGNET_POSITION = new Vector2( 200, Y_POSITION );
const PICKUP_COIL_POSITION = new Vector2( 500, Y_POSITION );
const COMPASS_POSITION = new Vector2( 635, Y_POSITION );

assert && assert( ELECTROMAGNET_POSITION.y === PICKUP_COIL_POSITION.y,
  'Electromagnet and pickup coil must have the same initial y coordinate for the Lock to Axis feature.' );

export default class TransformerScreenModel extends FELScreenModel {

  public readonly transformer: Transformer;

  public constructor( preferences: FELPreferences, tandem: Tandem ) {

    const transformer = new Transformer( preferences.currentFlowProperty, {
      electromagnetPosition: ELECTROMAGNET_POSITION,
      pickupCoilPosition: PICKUP_COIL_POSITION,
      tandem: tandem.createTandem( 'transformer' )
    } );

    super( transformer.electromagnet, preferences.magneticUnitsProperty, {
      createCompass: ( magnet, isPlayingProperty, tandem ) => new IncrementalCompass( magnet, isPlayingProperty, {
        position: COMPASS_POSITION,
        visible: false,
        tandem: tandem
      } ),
      tandem: tandem
    } );

    this.transformer = transformer;

    this.clock.addListener( dt => transformer.step( dt ) );
  }

  /**
   * Resets the model.
   */
  public override reset(): void {
    super.reset();
    this.transformer.reset();
  }
}

faradaysElectromagneticLab.register( 'TransformerScreenModel', TransformerScreenModel );