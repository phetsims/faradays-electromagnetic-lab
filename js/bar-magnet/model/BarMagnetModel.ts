// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnetModel is the top-level model for the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnet from '../../common/model/BarMagnet.js';
import Compass from '../../common/model/Compass.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import KinematicCompass from '../../common/model/KinematicCompass.js';
import FELModel from '../../common/model/FELModel.js';

export default class BarMagnetModel extends FELModel {

  public readonly barMagnet: BarMagnet;
  public readonly compass: Compass;

  public constructor( tandem: Tandem ) {

    const barMagnet = new BarMagnet( {
      position: new Vector2( 450, 300 ),
      tandem: tandem.createTandem( 'barMagnet' )
    } );

    super( barMagnet, {
      tandem: tandem,
      isPlayingPropertyOptions: {
        tandem: Tandem.OPT_OUT // because this screen has no time controls
      }
    } );

    this.barMagnet = barMagnet;

    this.compass = new KinematicCompass( barMagnet, this.isPlayingProperty, {
      position: new Vector2( 150, 300 ),
      tandem: tandem.createTandem( 'compass' )
    } );

    this.stepEmitter.addListener( dt => {
      this.compass.step( dt );
    } );
  }

  public override reset(): void {
    super.reset();
    this.barMagnet.reset();
    this.compass.reset();
  }
}

faradaysElectromagneticLab.register( 'BarMagnetModel', BarMagnetModel );