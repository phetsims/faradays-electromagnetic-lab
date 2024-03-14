// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnetScreenModel is the top-level model for the 'Bar Magnet' screen.
 *
 * Note that this class name differs from the PhET convention of {ScreenName}Model to avoid confusion between
 * the 'Bar Magnet' screen and the BarMagnet model element.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnet from '../../common/model/BarMagnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import KinematicCompass from '../../common/model/KinematicCompass.js';
import FELScreenModel from '../../common/model/FELScreenModel.js';

// Positions are factored out here because we've changed them so many times.
const BAR_MAGNET_POSITION = new Vector2( 430, 285 );
const COMPASS_POSITION = new Vector2( 625, 400 );

export default class BarMagnetScreenModel extends FELScreenModel {

  public readonly barMagnet: BarMagnet;

  public constructor( tandem: Tandem ) {

    const barMagnet = new BarMagnet( {
      position: BAR_MAGNET_POSITION,
      tandem: tandem.createTandem( 'barMagnet' )
    } );

    super( barMagnet, {
      createCompass: ( magnet, isPlayingProperty, tandem ) => new KinematicCompass( magnet, isPlayingProperty, {
        position: COMPASS_POSITION,
        tandem: tandem
      } ),
      isPlayingPropertyOptions: {
        tandem: Tandem.OPT_OUT // because this screen has no time controls
      },
      tandem: tandem
    } );

    this.barMagnet = barMagnet;

    assert && this.isPlayingProperty.link(
      isPlaying => assert && assert( isPlaying, 'isPlaying must always be true for the Bar Magnet screen.' ) );
  }

  public override reset(): void {
    super.reset();
    this.barMagnet.reset();
  }
}

faradaysElectromagneticLab.register( 'BarMagnetScreenModel', BarMagnetScreenModel );