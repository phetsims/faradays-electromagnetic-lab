// Copyright 2023-2024, University of Colorado Boulder

/**
 * GeneratorModel is the top-level model for the 'Generator' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FieldMeter from '../../common/model/FieldMeter.js';
import Compass from '../../common/model/Compass.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Generator from './Generator.js';
import ImmediateCompass from '../../common/model/ImmediateCompass.js';
import FELModel from '../../common/model/FELModel.js';

export default class GeneratorModel extends FELModel {

  public readonly generator: Generator;
  public readonly compass: Compass;
  public readonly fieldMeter: FieldMeter;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    this.generator = new Generator( tandem.createTandem( 'generator' ) );

    this.compass = new ImmediateCompass( this.generator.turbine.barMagnet, this.isPlayingProperty, {
      position: new Vector2( 625, 400 ),
      tandem: tandem.createTandem( 'compass' )
    } );

    this.fieldMeter = new FieldMeter( this.generator.turbine.barMagnet, {
      position: new Vector2( 650, 300 ),
      visible: false,
      tandem: tandem.createTandem( 'fieldMeter' )
    } );

    this.stepEmitter.addListener( dt => {
      this.generator.step( dt );
      this.compass.step( dt );
    } );
  }

  public override reset(): void {
    super.reset();
    this.generator.reset();
    this.compass.reset();
    this.fieldMeter.reset();
  }
}

faradaysElectromagneticLab.register( 'GeneratorModel', GeneratorModel );