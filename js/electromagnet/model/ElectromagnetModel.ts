// Copyright 2023-2024, University of Colorado Boulder

/**
 * ElectromagnetModel is the top-level model for the 'Electromagnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Compass from '../../common/model/Compass.js';
import Electromagnet from '../../common/model/Electromagnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IncrementalCompass from '../../common/model/IncrementalCompass.js';
import FELModel from '../../common/model/FELModel.js';

export default class ElectromagnetModel extends FELModel {

  public readonly electromagnet: Electromagnet;
  public readonly compass: Compass;

  public constructor( tandem: Tandem ) {

    const electromagnet = new Electromagnet( {
      position: new Vector2( 400, 400 ),
      tandem: tandem.createTandem( 'electromagnet' )
    } );

    super( electromagnet, {
      tandem: tandem
    } );

    this.electromagnet = electromagnet;

    this.compass = new IncrementalCompass( electromagnet, this.isPlayingProperty, {
      position: new Vector2( 150, 200 ),
      tandem: tandem.createTandem( 'compass' )
    } );

    this.stepEmitter.addListener( dt => {
      electromagnet.step( dt );
      this.compass.step( dt );
    } );
  }

  public override reset(): void {
    super.reset();
    this.electromagnet.reset();
    this.compass.reset();
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetModel', ElectromagnetModel );