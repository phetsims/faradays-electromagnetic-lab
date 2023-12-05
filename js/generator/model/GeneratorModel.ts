// Copyright 2023, University of Colorado Boulder

/**
 * GeneratorModel is the top-level model for the 'Generator' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PickupCoil from '../../common/model/PickupCoil.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Compass from '../../common/model/Compass.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Turbine from './Turbine.js';
import ImmediateCompass from '../../common/model/ImmediateCompass.js';

export default class GeneratorModel implements TModel {

  public readonly turbine: Turbine;
  public readonly pickupCoil: PickupCoil;
  public readonly fieldMeter: FieldMeter;
  public readonly compass: Compass;

  public constructor( tandem: Tandem ) {

    this.turbine = new Turbine( {
      position: new Vector2( 450, 300 ),
      tandem: tandem.createTandem( 'turbine' )
    } );

    this.pickupCoil = new PickupCoil( this.turbine, {
      position: new Vector2( 500, 400 ),
      calibrationEMF: 2700000, //TODO incorrect, see GeneratorModule.java
      transitionSmoothingScale: 0.77, //TODO incorrect, see GeneratorModule.java
      tandem: tandem.createTandem( 'pickupCoil' )
    } );

    this.fieldMeter = new FieldMeter( this.turbine, {
      position: new Vector2( 150, 400 ),
      tandem: tandem.createTandem( 'fieldMeter' )
    } );

    this.compass = new ImmediateCompass( this.turbine, {
      position: new Vector2( 150, 300 ),
      tandem: tandem.createTandem( 'compass' )
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.turbine.reset();
    this.pickupCoil.reset();
    this.fieldMeter.reset();
    this.compass.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO this.turbine.step( dt );
    //TODO this.pickupCoil.step( dt );
    this.compass.step( dt );
  }
}

faradaysElectromagneticLab.register( 'GeneratorModel', GeneratorModel );