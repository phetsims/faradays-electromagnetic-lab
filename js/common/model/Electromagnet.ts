// Copyright 2023-2024, University of Colorado Boulder

/**
 * Electromagnet is the model of the electromagnet. The shape of the model is a circle, and the calculation of the
 * magnetic field at some point of interest varies depending on whether the point is inside or outside the circle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import SourceCoil from './SourceCoil.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ACPowerSupply from './ACPowerSupply.js';
import Battery from './Battery.js';
import CurrentSource from './CurrentSource.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Range from '../../../../dot/js/Range.js';
import CoilMagnet, { CoilMagnetOptions } from './CoilMagnet.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

export type ElectromagnetOptions = SelfOptions & CoilMagnetOptions;

export default class Electromagnet extends CoilMagnet {

  public readonly sourceCoil: SourceCoil;

  public readonly battery: Battery;
  public readonly acPowerSupply: ACPowerSupply;
  public readonly currentSourceProperty: Property<CurrentSource>;

  public readonly electronsVisibleProperty: Property<boolean>;

  // Electromagnet is modeled as a circle
  public readonly radiusProperty: TReadOnlyProperty<number>;

  // *** Writeable via developer controls only, when running with &dev query parameter. ***
  // Makes the magnet model shape visible in the view.
  public readonly shapeVisibleProperty: Property<boolean>;

  public constructor( providedOptions: ElectromagnetOptions ) {

    const options = providedOptions;

    const battery = new Battery( options.tandem.createTandem( 'battery' ) );

    const acPowerSupply = new ACPowerSupply( options.tandem.createTandem( 'acPowerSupply' ) );

    const currentSourceProperty = new Property<CurrentSource>( battery, {
      validValues: [ battery, acPowerSupply ],
      tandem: options.tandem.createTandem( 'currentSourceProperty' ),
      phetioValueType: CurrentSource.CurrentSourceIO,
      phetioFeatured: true
    } );

    // Current in the coil is equivalent to amplitude of the selected current source.
    const currentAmplitudeProperty = new DerivedProperty(
      [ currentSourceProperty, battery.amplitudeProperty, acPowerSupply.amplitudeProperty ],
      ( currentSource, batteryAmplitude, acPowerSupplyAmplitude ) =>
        ( currentSource === battery ) ? batteryAmplitude : acPowerSupplyAmplitude, {
        tandem: options.tandem.createTandem( 'currentAmplitudeProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true
      } );

    const sourceCoil = new SourceCoil( currentAmplitudeProperty, options.tandem.createTandem( 'sourceCoil' ) );

    const strengthRange = new Range( 0, 300 ); // gauss

    // Strength of the magnet is proportional to its EMF.
    const strengthProperty = new DerivedProperty( [ sourceCoil.currentAmplitudeProperty ],
      currentAmplitude => Math.abs( currentAmplitude ) * strengthRange.max, {
        tandem: options.tandem.createTandem( 'strengthProperty' ),
        phetioValueType: NumberIO
      } );

    super( sourceCoil, strengthProperty, strengthRange, options );

    this.sourceCoil = sourceCoil;
    this.battery = battery;
    this.acPowerSupply = acPowerSupply;
    this.currentSourceProperty = currentSourceProperty;

    // Polarity is determined by the sign of the current amplitude.
    this.sourceCoil.currentAmplitudeProperty.link( currentAmplitude => {
      this.rotationProperty.value = ( currentAmplitude >= 0 ) ? 0 : Math.PI;
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
}

faradaysElectromagneticLab.register( 'Electromagnet', Electromagnet );