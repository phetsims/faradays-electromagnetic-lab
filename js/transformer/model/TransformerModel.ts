// Copyright 2023, University of Colorado Boulder

/**
 * TransformerModel is the top-level model for the 'Transformer' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Electromagnet from '../../common/model/Electromagnet.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Compass from '../../common/model/Compass.js';
import PickupCoil, { FixedSpacingSamplePointsStrategy } from '../../common/model/PickupCoil.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IncrementalCompass from '../../common/model/IncrementalCompass.js';
import FELModel from '../../common/model/FELModel.js';

export default class TransformerModel extends FELModel {

  public readonly electromagnet: Electromagnet;
  public readonly pickupCoil: PickupCoil;
  public readonly compass: Compass;
  public readonly fieldMeter: FieldMeter;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    this.electromagnet = new Electromagnet( {
      position: new Vector2( 200, 400 ),
      tandem: tandem.createTandem( 'electromagnet' )
    } );

    this.pickupCoil = new PickupCoil( this.electromagnet, {
      position: new Vector2( 500, 400 ),
      maxEMF: 3500000, // see PickupCoil.calibrateMaxEMF
      transitionSmoothingScale: 0.56, // see PickupCoil.transitionSmoothingScaleProperty
      electronSpeedScale: 2,
      samplePointsStrategy: new FixedSpacingSamplePointsStrategy( 5.4 ), // same as Java version
      tandem: tandem.createTandem( 'pickupCoil' )
    } );

    this.compass = new IncrementalCompass( this.electromagnet, {
      position: new Vector2( 100, 525 ),
      visible: false,
      tandem: tandem.createTandem( 'compass' )
    } );

    this.fieldMeter = new FieldMeter( this.electromagnet, {
      position: new Vector2( 150, 400 ),
      visible: false,
      tandem: tandem.createTandem( 'fieldMeter' )
    } );

    this.stepEmitter.addListener( dt => {
      this.electromagnet.step( dt );
      this.pickupCoil.step( dt );
      this.compass.step( dt );
    } );
  }

  /**
   * Resets the model.
   */
  public override reset(): void {
    super.reset();
    this.electromagnet.reset();
    this.pickupCoil.reset();
    this.compass.reset();
    this.fieldMeter.reset();
  }
}

faradaysElectromagneticLab.register( 'TransformerModel', TransformerModel );