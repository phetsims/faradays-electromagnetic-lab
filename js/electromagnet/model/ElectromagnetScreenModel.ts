// Copyright 2023-2024, University of Colorado Boulder

/**
 * ElectromagnetScreenModel is the top-level model for the 'Electromagnet' screen.
 *
 * Note that the name of this class differs from PhET conventions (ElectromagnetModel) to avoid confusion with the
 * Electromagnet model element.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Electromagnet from '../../common/model/Electromagnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IncrementalCompass from '../../common/model/IncrementalCompass.js';
import FELModel from '../../common/model/FELModel.js';

export default class ElectromagnetScreenModel extends FELModel {

  public readonly electromagnet: Electromagnet;

  public constructor( tandem: Tandem ) {

    const electromagnet = new Electromagnet( {
      position: new Vector2( 400, 400 ),
      tandem: tandem.createTandem( 'electromagnet' )
    } );

    super( electromagnet, {
      createCompass: ( magnet, isPlayingProperty, tandem ) => new IncrementalCompass( magnet, isPlayingProperty, {
        position: new Vector2( 150, 200 ),
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