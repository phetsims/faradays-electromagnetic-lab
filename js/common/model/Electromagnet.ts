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
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ACPowerSupply from './ACPowerSupply.js';
import Battery from './Battery.js';
import CurrentSource from './CurrentSource.js';

type SelfOptions = {
  //TODO
};

export type ElectromagnetOptions = SelfOptions & MagnetOptions;

export default class Electromagnet extends Magnet {

  public readonly battery: Battery;
  public readonly acPowerSupply: ACPowerSupply;

  public readonly currentSourceProperty: Property<CurrentSource>;
  public readonly sourceCoil: SourceCoil;
  public readonly electronsVisibleProperty: Property<boolean>;

  // *** Writeable via developer controls only, when running with &dev query parameter. ***
  // Makes the magnet model shape visible in the view.
  public readonly shapeVisibleProperty: Property<boolean>;

  public constructor( providedOptions: ElectromagnetOptions ) {

    const options = providedOptions;

    super( options );

    this.battery = new Battery( options.tandem.createTandem( 'battery' ) );

    this.acPowerSupply = new ACPowerSupply( options.tandem.createTandem( 'acPowerSupply' ) );

    this.currentSourceProperty = new Property<CurrentSource>( this.battery, {
      validValues: [ this.battery, this.acPowerSupply ],
      tandem: options.tandem.createTandem( 'currentSourceProperty' ),
      phetioValueType: CurrentSource.CurrentSourceIO,
      phetioFeatured: true
    } );

    this.sourceCoil = new SourceCoil( this, {
      tandem: options.tandem.createTandem( 'sourceCoil' )
    } );

    this.electronsVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'electronsVisibleProperty' ),
      phetioFeatured: true
    } );

    this.shapeVisibleProperty = new BooleanProperty( false, {
      // Do not instrument. This is a PhET developer Property.
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
    this.battery.reset();
    this.acPowerSupply.reset();
    this.currentSourceProperty.reset();
    this.sourceCoil.reset();
    this.electronsVisibleProperty.reset();
  }

  public step( dt: number ): void {
    assert && assert( dt === 1, `invalid dt=${dt}, see FELModel step` );
    //TODO beware of dependencies on SwingClock.java !!
    this.acPowerSupply.step( dt );
  }
}

faradaysElectromagneticLab.register( 'Electromagnet', Electromagnet );