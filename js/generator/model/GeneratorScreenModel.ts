// Copyright 2023-2024, University of Colorado Boulder

/**
 * GeneratorScreenModel is the top-level model for the 'Generator' screen.
 *
 * Note that this class name differs from the PhET convention of {ScreenName}Model to avoid confusion between
 * the Generator screen and the Generator model element.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Generator from './Generator.js';
import ImmediateCompass from '../../common/model/ImmediateCompass.js';
import FELScreenModel from '../../common/model/FELScreenModel.js';

// y position shared by all components, so that they are on the same x-axis.
const Y_POSITION = 375;

// Positions are factored out here because we've changed them so many times.
const TURBINE_POSITION = new Vector2( 285, Y_POSITION );
const PICKUP_COIL_POSITION = new Vector2( 520, Y_POSITION );
const COMPASS_POSITION = new Vector2( 655, Y_POSITION );

export default class GeneratorScreenModel extends FELScreenModel {

  public readonly generator: Generator;

  public constructor( tandem: Tandem ) {

    const generator = new Generator( {
      turbinePosition: TURBINE_POSITION,
      pickupCoilPosition: PICKUP_COIL_POSITION,
      tandem: tandem.createTandem( 'generator' )
    } );

    super( generator.turbine.barMagnet, {
      createCompass: ( magnet, isPlayingProperty, tandem ) => new ImmediateCompass( magnet, isPlayingProperty, {
        position: COMPASS_POSITION,
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