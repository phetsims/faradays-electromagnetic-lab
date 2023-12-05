// Copyright 2023, University of Colorado Boulder

/**
 * ElectromagnetModel is the top-level model for the 'Electromagnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Compass from '../../common/model/Compass.js';
import Electromagnet from '../../common/model/Electromagnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IncrementalCompass from '../../common/model/IncrementalCompass.js';

export default class ElectromagnetModel implements TModel {

  public readonly electromagnet: Electromagnet;
  public readonly fieldMeter: FieldMeter;
  public readonly compass: Compass;

  public constructor( tandem: Tandem ) {

    this.electromagnet = new Electromagnet( {
      position: new Vector2( 400, 400 ),
      tandem: tandem.createTandem( 'electromagnet' )
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
    this.fieldMeter.reset();
    this.compass.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO this.electromagnet.step();
    this.compass.step( dt );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetModel', ElectromagnetModel );