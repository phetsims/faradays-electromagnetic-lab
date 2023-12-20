// Copyright 2023, University of Colorado Boulder

/**
 * GeneratorModel is the top-level model for the 'Generator' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PickupCoil from '../../common/model/PickupCoil.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Compass from '../../common/model/Compass.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Turbine from './Turbine.js';
import ImmediateCompass from '../../common/model/ImmediateCompass.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import FELModel from '../../common/model/FELModel.js';

export default class GeneratorModel extends FELModel {

  public readonly turbine: Turbine;
  public readonly pickupCoil: PickupCoil;
  public readonly compass: Compass;
  public readonly fieldMeter: FieldMeter;

  public constructor( tandem: Tandem ) {

    super( tandem );

    this.turbine = new Turbine( {
      strengthRange: new RangeWithValue( 0, 300, 225 ), // gauss
      position: new Vector2( 285, 400 ),
      tandem: tandem.createTandem( 'turbine' )
    } );

    this.pickupCoil = new PickupCoil( this.turbine, {
      position: new Vector2( 500, 400 ),
      maxEMF: 26000, // see PickupCoil.calibrateMaxEMF
      transitionSmoothingScale: 1, // see PickupCoil.transitionSmoothingScaleProperty
      tandem: tandem.createTandem( 'pickupCoil' )
    } );

    this.compass = new ImmediateCompass( this.turbine, {
      position: new Vector2( 350, 175 ),
      tandem: tandem.createTandem( 'compass' )
    } );

    this.fieldMeter = new FieldMeter( this.turbine, {
      position: new Vector2( 450, 460 ),
      visible: false,
      tandem: tandem.createTandem( 'fieldMeter' )
    } );

    this.stepEmitter.addListener( dt => {
      this.turbine.step( dt );
      this.pickupCoil.step( dt );
      this.compass.step( dt );
    } );
  }

  public override reset(): void {
    super.reset();
    this.turbine.reset();
    this.pickupCoil.reset();
    this.compass.reset();
    this.fieldMeter.reset();
  }
}

faradaysElectromagneticLab.register( 'GeneratorModel', GeneratorModel );