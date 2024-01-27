// Copyright 2023-2024, University of Colorado Boulder

/**
 * TransformerModel is the top-level model for the 'Transformer' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Compass from '../../common/model/Compass.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IncrementalCompass from '../../common/model/IncrementalCompass.js';
import FELModel from '../../common/model/FELModel.js';
import Transformer from './Transformer.js';

export default class TransformerModel extends FELModel {

  public readonly transformer: Transformer;
  public readonly compass: Compass;

  public constructor( tandem: Tandem ) {

    const transformer = new Transformer( tandem.createTandem( 'transformer' ) );

    super( transformer.electromagnet, {
      tandem: tandem
    } );

    this.transformer = transformer;

    this.compass = new IncrementalCompass( transformer.electromagnet, this.isPlayingProperty, {
      position: new Vector2( 100, 525 ),
      visible: false,
      tandem: tandem.createTandem( 'compass' )
    } );

    this.stepEmitter.addListener( dt => {
      transformer.step( dt );
      this.compass.step( dt );
    } );
  }

  /**
   * Resets the model.
   */
  public override reset(): void {
    super.reset();
    this.transformer.reset();
    this.compass.reset();
  }
}

faradaysElectromagneticLab.register( 'TransformerModel', TransformerModel );