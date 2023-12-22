// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetModel is the top-level model for the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnet from '../../common/model/BarMagnet.js';
import Compass from '../../common/model/Compass.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import KinematicCompass from '../../common/model/KinematicCompass.js';
import FELModel from '../../common/model/FELModel.js';

export default class BarMagnetModel extends FELModel {

  public readonly barMagnet: BarMagnet;
  public readonly compass: Compass;
  public readonly fieldMeter: FieldMeter;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem,
      isPlayingPropertyInstrumented: false // because this screen has no time controls
    } );

    this.barMagnet = new BarMagnet( {
      position: new Vector2( 450, 300 ),
      tandem: tandem.createTandem( 'barMagnet' )
    } );

    this.compass = new KinematicCompass( this.barMagnet, {
      position: new Vector2( 150, 300 ),
      tandem: tandem.createTandem( 'compass' )
    } );

    this.fieldMeter = new FieldMeter( this.barMagnet, {
      position: new Vector2( 150, 400 ),
      visible: false,
      tandem: tandem.createTandem( 'fieldMeter' )
    } );

    this.stepEmitter.addListener( dt => {
      this.compass.step( dt );
    } );
  }

  public override reset(): void {
    super.reset();
    this.barMagnet.reset();
    this.compass.reset();
    this.fieldMeter.reset();
  }
}

faradaysElectromagneticLab.register( 'BarMagnetModel', BarMagnetModel );