// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Magnet, { MagnetOptions } from './Magnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SourceCoil from './SourceCoil.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import { CurrentSource, CurrentSourceValues } from './CurrentSource.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = {
  //TODO
};

export type ElectromagnetOptions = SelfOptions & MagnetOptions;

export default class Electromagnet extends Magnet {

  public readonly currentSourceProperty: Property<CurrentSource>;
  public readonly sourceCoil: SourceCoil;

  public constructor( providedOptions: ElectromagnetOptions ) {

    const options = providedOptions;

    super( options );

    this.currentSourceProperty = new StringUnionProperty<CurrentSource>( 'battery', {
      validValues: CurrentSourceValues,
      tandem: options.tandem.createTandem( 'currentSourceProperty' ),
      phetioFeatured: true
    } );

    this.sourceCoil = new SourceCoil( this, {
      tandem: options.tandem.createTandem( 'sourceCoil' )
    } );

    //TODO
  }

  /**
   * TODO
   */
  protected override getLocalFieldVector( position: Vector2, outputVector: Vector2 ): Vector2 {
    return new Vector2( 0, 0 ); //TODO
  }

  public override reset(): void {
    super.reset();
    this.currentSourceProperty.reset();
    this.sourceCoil.reset();
  }
}

faradaysElectromagneticLab.register( 'Electromagnet', Electromagnet );