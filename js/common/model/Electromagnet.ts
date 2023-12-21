// Copyright 2023, University of Colorado Boulder

/**
 * Electromagnet is the model of the electromagnet. The shape of the model is a circle, and the calculation of the
 * magnetic field at some point of interest varies depending on whether the point is inside or outside the circle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Magnet, { MagnetOptions } from './Magnet.js';
import SourceCoil from './SourceCoil.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ACPowerSupply from './ACPowerSupply.js';
import Battery from './Battery.js';
import CurrentSource from './CurrentSource.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Vector2 from '../../../../dot/js/Vector2.js';

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

  // Electromagnet is modeled as a circle
  public readonly radiusProperty: TReadOnlyProperty<number>;

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

    this.sourceCoil = new SourceCoil( options.tandem.createTandem( 'sourceCoil' ) );

    //TODO It would be nice to pass currentAmplitudeProperty directly to sourceCoil.
    const amplitudeProperty = new DerivedProperty(
      [ this.currentSourceProperty, this.battery.amplitudeProperty, this.acPowerSupply.amplitudeProperty ],
      ( currentSource, batteryAmplitude, acPowerSupplyAmplitude ) =>
        ( currentSource === this.battery ) ? batteryAmplitude : acPowerSupplyAmplitude
    );
    amplitudeProperty.link( ( amplitude, previousAmplitude ) => {
      this.sourceCoil.setCurrentAmplitude( amplitude );
      if ( previousAmplitude !== null ) {
        //TODO is this correct? What about Math.sign === 0?
        if ( Math.sign( amplitude ) !== Math.sign( previousAmplitude ) ) {
          this.flipPolarity();
        }
      }
    } );

    // Strength of the magnet is proportional to its EMF.
    //TODO strengthProperty should be a DerivedProperty for Electromagnet
    this.sourceCoil.currentAmplitudeProperty.link( currentAmplitude => {
      this.strengthProperty.value = Math.abs( currentAmplitude ) * this.strengthProperty.range.max;
    } );

    this.radiusProperty = new DerivedProperty( [ this.sourceCoil.loopRadiusProperty ],
      loopRadius => loopRadius + ( this.sourceCoil.wireWidth / 2 ), {
        tandem: options.tandem.createTandem( 'radiusProperty' ),
        phetioValueType: NumberIO
      } );

    this.electronsVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'electronsVisibleProperty' ),
      phetioFeatured: true
    } );

    this.shapeVisibleProperty = new BooleanProperty( false, {
      // Do not instrument. This is a PhET developer Property.
    } );
  }

  public override reset(): void {
    super.reset();
    this.battery.reset();
    this.acPowerSupply.reset();
    this.currentSourceProperty.reset();
    this.sourceCoil.reset();
    this.electronsVisibleProperty.reset();
    // Do not reset shapeVisibleProperty, it is a developer control.
  }

  public step( dt: number ): void {
    assert && assert( dt === 1, `invalid dt=${dt}, see FELModel step` );
    if ( this.currentSourceProperty.value === this.acPowerSupply ) {
      this.acPowerSupply.step( dt );
    }
  }

  /**
   * TODO
   */
  protected override getLocalFieldVector( position: Vector2, outputVector: Vector2 ): Vector2 {
    return new Vector2( 0, 0 ); //TODO
  }
}

faradaysElectromagneticLab.register( 'Electromagnet', Electromagnet );