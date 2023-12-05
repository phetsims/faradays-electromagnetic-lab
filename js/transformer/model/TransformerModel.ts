// Copyright 2023, University of Colorado Boulder

/**
 * TransformerModel is the top-level model for the 'Transformer' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Electromagnet from '../../common/model/Electromagnet.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Compass from '../../common/model/Compass.js';
import PickupCoil from '../../common/model/PickupCoil.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IncrementalCompass from '../../common/model/IncrementalCompass.js';

export default class TransformerModel implements TModel {

  public readonly electromagnet: Electromagnet;
  public readonly pickupCoil: PickupCoil;
  public readonly fieldMeter: FieldMeter;
  public readonly compass: Compass;

  public constructor( tandem: Tandem ) {

    this.electromagnet = new Electromagnet( {
      position: new Vector2( 400, 400 ),
      tandem: tandem.createTandem( 'electromagnet' )
    } );

    this.pickupCoil = new PickupCoil( this.electromagnet, {
      position: new Vector2( 500, 400 ),
      calibrationEMF: 2700000, //TODO incorrect, see TransformerModule.java
      transitionSmoothingScale: 0.77, //TODO incorrect, see TransformerModule.java
      tandem: tandem.createTandem( 'pickupCoil' )
    } );

    this.fieldMeter = new FieldMeter( this.electromagnet, {
      position: new Vector2( 150, 400 ),
      tandem: tandem.createTandem( 'fieldMeter' )
    } );

    this.compass = new IncrementalCompass( this.electromagnet, {
      position: new Vector2( 150, 300 ),
      tandem: tandem.createTandem( 'compass' )
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.electromagnet.reset();
    this.pickupCoil.reset();
    this.fieldMeter.reset();
    this.compass.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO this.electromagnet.step( dt );
    //TODO this.pickupCoil.step( dt );
    this.compass.step( dt );
  }
}

faradaysElectromagneticLab.register( 'TransformerModel', TransformerModel );