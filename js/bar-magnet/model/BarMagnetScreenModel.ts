// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnetScreenModel is the top-level model for the 'Bar Magnet' screen.
 *
 * Note that the name of this class differs from PhET conventions (BarMagnetModel) to avoid confusion with the
 * BarMagnet model element.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnet from '../../common/model/BarMagnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import KinematicCompass from '../../common/model/KinematicCompass.js';
import FELModel from '../../common/model/FELModel.js';

export default class BarMagnetScreenModel extends FELModel {

  public readonly barMagnet: BarMagnet;

  public constructor( tandem: Tandem ) {

    const barMagnet = new BarMagnet( {
      position: new Vector2( 450, 300 ),
      tandem: tandem.createTandem( 'barMagnet' )
    } );

    super( barMagnet, {
      createCompass: ( magnet, isPlayingProperty, tandem ) => new KinematicCompass( magnet, isPlayingProperty, {
        position: new Vector2( 150, 300 ),
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