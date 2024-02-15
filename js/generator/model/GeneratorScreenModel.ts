// Copyright 2023-2024, University of Colorado Boulder

/**
 * GeneratorScreenModel is the top-level model for the 'Generator' screen.
 *
 * Note that the name of this class differs from PhET conventions (GeneratorModel) to avoid confusion with the
 * Generator model element.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Generator from './Generator.js';
import ImmediateCompass from '../../common/model/ImmediateCompass.js';
import FELScreenModel from '../../common/model/FELScreenModel.js';

export default class GeneratorScreenModel extends FELScreenModel {

  public readonly generator: Generator;

  public constructor( tandem: Tandem ) {

    const generator = new Generator( tandem.createTandem( 'generator' ) );

    super( generator.turbine.barMagnet, {
      createCompass: ( magnet, isPlayingProperty, tandem ) => new ImmediateCompass( magnet, isPlayingProperty, {
        position: new Vector2( 625, 400 ),
        tandem: tandem
      } ),
      tandem: tandem
    } );

    this.generator = generator;

    this.clock.addListener( dt => generator.step( dt ) );
  }

  public override reset(): void {
    super.reset();
    this.generator.reset();
  }
}

faradaysElectromagneticLab.register( 'GeneratorScreenModel', GeneratorScreenModel );