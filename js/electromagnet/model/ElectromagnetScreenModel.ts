// Copyright 2023-2024, University of Colorado Boulder

/**
 * ElectromagnetScreenModel is the top-level model for the 'Electromagnet' screen.
 *
 * Note that this class name differs from the PhET convention of {ScreenName}Model to avoid confusion between
 * the Electromagnet screen and the Electromagnet model element.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Electromagnet from '../../common/model/Electromagnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IncrementalCompass from '../../common/model/IncrementalCompass.js';
import FELScreenModel from '../../common/model/FELScreenModel.js';
import FELPreferences from '../../common/model/FELPreferences.js';

// y position shared by all components, so that they are on the same horizontal axis.
const Y_POSITION = 400;

// Positions are factored out here because we've changed them so many times.
const ELECTROMAGNET_POSITION = new Vector2( 400, Y_POSITION );
const COMPASS_POSITION = new Vector2( 625, Y_POSITION );

export default class ElectromagnetScreenModel extends FELScreenModel {

  public readonly electromagnet: Electromagnet;

  public constructor( preferences: FELPreferences, tandem: Tandem ) {

    const electromagnet = new Electromagnet( preferences.currentFlowProperty, {
      position: ELECTROMAGNET_POSITION,
      tandem: tandem.createTandem( 'electromagnet' )
    } );

    super( electromagnet, preferences.magneticUnitsProperty, {
      createCompass: ( magnet, isPlayingProperty, tandem ) => new IncrementalCompass( magnet, isPlayingProperty, {
        position: COMPASS_POSITION,
        tandem: tandem
      } ),
      tandem: tandem
    } );

    this.electromagnet = electromagnet;

    this.clock.addListener( dt => electromagnet.step( dt ) );
  }

  public override reset(): void {
    super.reset();
    this.electromagnet.reset();
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetScreenModel', ElectromagnetScreenModel );