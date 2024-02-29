// Copyright 2023-2024, University of Colorado Boulder

/**
 * ElectromagnetScreenModel is the top-level model for the 'Electromagnet' screen.
 *
 * Note that this class name differs from the PhET convention of {ScreenName}Model to avoid confusion between
 * the Electromagnet screen and the Electromagnet model element.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Electromagnet from '../../common/model/Electromagnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IncrementalCompass from '../../common/model/IncrementalCompass.js';
import FELScreenModel from '../../common/model/FELScreenModel.js';

export default class ElectromagnetScreenModel extends FELScreenModel {

  public readonly electromagnet: Electromagnet;

  public constructor( tandem: Tandem ) {

    const electromagnet = new Electromagnet( {
      position: new Vector2( 400, 400 ),
      tandem: tandem.createTandem( 'electromagnet' )
    } );

    super( electromagnet, {
      createCompass: ( magnet, isPlayingProperty, tandem ) => new IncrementalCompass( magnet, isPlayingProperty, {
        position: new Vector2( 625, 400 ),
        tandem: tandem
      } ),
      tandem: tandem
    } );

    this.electromagnet = electromagnet;

    this.clock.addListener( dt => electromagnet.step( dt ) );
  }

  public override reset(): void {
    super.reset();
    this.electromagnet.reset();
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetScreenModel', ElectromagnetScreenModel );