// Copyright 2023-2024, University of Colorado Boulder

/**
 * Electromagnet is the model of the electromagnet. The shape of the model is a circle, and the calculation of the
 * magnetic field at some point of interest varies depending on whether the point is inside or outside the circle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ACPowerSupply from './ACPowerSupply.js';
import DCPowerSupply from './DCPowerSupply.js';
import CurrentSource from './CurrentSource.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Range from '../../../../dot/js/Range.js';
import CoilMagnet, { CoilMagnetOptions } from './CoilMagnet.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import FELModel from './FELModel.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Coil from './Coil.js';

const STRENGTH_RANGE = new Range( 0, 300 ); // gauss
const CURRENT_AMPLITUDE_RANGE = new Range( -1, 1 );
const WIRE_WIDTH = 16;
const LOOP_SPACING = WIRE_WIDTH; // closely-packed loops

type SelfOptions = EmptySelfOptions;

export type ElectromagnetOptions = SelfOptions & CoilMagnetOptions;

export default class Electromagnet extends CoilMagnet {

  public readonly coil: Coil;

  public readonly dcPowerSupply: DCPowerSupply;
  public readonly acPowerSupply: ACPowerSupply;
  public readonly currentSourceProperty: Property<CurrentSource>;

  // *** Writeable via developer controls only, when running with &dev query parameter. ***
  // Makes the magnet model shape visible in the view.
  public readonly shapeVisibleProperty: Property<boolean>;

  public constructor( providedOptions: ElectromagnetOptions ) {

    const options = providedOptions;

    const dcPowerSupply = new DCPowerSupply( options.tandem.createTandem( 'dcPowerSupply' ) );

    const acPowerSupply = new ACPowerSupply( options.tandem.createTandem( 'acPowerSupply' ) );

    const currentSourceProperty = new Property<CurrentSource>( dcPowerSupply, {
      validValues: [ dcPowerSupply, acPowerSupply ],
      tandem: options.tandem.createTandem( 'currentSourceProperty' ),
      phetioValueType: CurrentSource.CurrentSourceIO,
      phetioFeatured: true
    } );

    // Current in the coil is equivalent to amplitude of the selected current source.
    const currentAmplitudeProperty = new DerivedProperty(
      [ currentSourceProperty, dcPowerSupply.amplitudeProperty, acPowerSupply.amplitudeProperty ],
      ( currentSource, batteryAmplitude, acPowerSupplyAmplitude ) =>
        ( currentSource === dcPowerSupply ) ? batteryAmplitude : acPowerSupplyAmplitude, {
        isValidValue: currentAmplitude => CURRENT_AMPLITUDE_RANGE.contains( currentAmplitude ),
        tandem: options.tandem.createTandem( 'currentAmplitudeProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true
      } );

    const coil = new Coil( currentAmplitudeProperty, {
      maxLoopArea: 7854, // in the Java version, max radius was 50, so max area was Math.PI * 50 * 50 = 7853.981633974483
      loopAreaPercentRange: new RangeWithValue( 100, 100, 100 ), // fixed loop area
      numberOfLoopsRange: new RangeWithValue( 1, 4, 4 ),
      wireWidth: WIRE_WIDTH,
      loopSpacing: LOOP_SPACING,
      tandem: options.tandem.createTandem( 'coil' )
    } );

    // Strength of the magnet is proportional to its EMF.
    const strengthProperty = new DerivedProperty( [ coil.currentAmplitudeProperty ],
      currentAmplitude => Math.abs( currentAmplitude ) * STRENGTH_RANGE.max, {
        isValidValue: strength => STRENGTH_RANGE.contains( strength ),
        tandem: options.tandem.createTandem( 'strengthProperty' ),
        phetioValueType: NumberIO
      } );

    super( coil, strengthProperty, STRENGTH_RANGE, options );

    this.coil = coil;
    this.dcPowerSupply = dcPowerSupply;
    this.acPowerSupply = acPowerSupply;
    this.currentSourceProperty = currentSourceProperty;

    // Polarity is determined by the sign of the current amplitude.
    this.coil.currentAmplitudeProperty.link( currentAmplitude => {
      this.rotationProperty.value = ( currentAmplitude >= 0 ) ? 0 : Math.PI;
    } );

    this.shapeVisibleProperty = new BooleanProperty( false
      // Do not instrument. This is a PhET developer Property.
    );
  }

  public override reset(): void {
    super.reset();
    this.dcPowerSupply.reset();
    this.acPowerSupply.reset();
    this.currentSourceProperty.reset();
    this.coil.reset();
    // Do not reset shapeVisibleProperty, it is a developer control.
  }

  public step( dt: number ): void {
    assert && assert( dt === FELModel.CONSTANT_DT, `invalid dt=${dt}, see FELModel step` );
    if ( this.currentSourceProperty.value === this.acPowerSupply ) {
      this.acPowerSupply.step( dt );
    }
  }
}

faradaysElectromagneticLab.register( 'Electromagnet', Electromagnet );