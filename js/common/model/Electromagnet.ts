// Copyright 2023-2024, University of Colorado Boulder

/**
 * Electromagnet is the model of an electromagnet. It includes a source coil, and selectable power supplies (DC & AC).
 *
 * This is based on Electromagnet.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELConstants from '../FELConstants.js';
import { CurrentFlow } from '../FELQueryParameters.js';
import ACPowerSupply from './ACPowerSupply.js';
import Coil from './Coil.js';
import CoilMagnet, { CoilMagnetOptions } from './CoilMagnet.js';
import CurrentSource from './CurrentSource.js';
import DCPowerSupply from './DCPowerSupply.js';

type SelfOptions = EmptySelfOptions;

export type ElectromagnetOptions = SelfOptions & CoilMagnetOptions;

export default class Electromagnet extends CoilMagnet {

  public readonly coil: Coil;

  public readonly dcPowerSupply: DCPowerSupply;
  public readonly acPowerSupply: ACPowerSupply;

  // The selected power supply, called currentSourceProperty because the UI label is 'Current Source'.
  public readonly currentSourceProperty: Property<CurrentSource>;

  // DEBUG: Writeable via developer controls only, when running with &dev query parameter.
  // Makes the magnet model shape visible in the view.
  public readonly shapeVisibleProperty: Property<boolean>;

  public constructor( currentFlowProperty: TReadOnlyProperty<CurrentFlow>, providedOptions: ElectromagnetOptions ) {

    const options = providedOptions;

    // We want some Properties to appear to be children of the coil element. We could also have done this by
    // subclassing Coil, but that seemed unnecessary in this case.
    const coilTandem = options.tandem.createTandem( 'coil' );

    const dcPowerSupply = new DCPowerSupply( options.tandem.createTandem( 'dcPowerSupply' ) );

    const acPowerSupply = new ACPowerSupply( options.tandem.createTandem( 'acPowerSupply' ) );

    const currentSourceProperty = new Property<CurrentSource>( dcPowerSupply, {
      validValues: [ dcPowerSupply, acPowerSupply ],
      tandem: options.tandem.createTandem( 'currentSourceProperty' ),
      phetioValueType: CurrentSource.CurrentSourceIO,
      phetioFeatured: true
    } );

    // Normalized current in the coil is equivalent to the normalized current produced by the selected power supply,
    // See Coil normalizedCurrentProperty for additional documentation.
    const normalizedCurrentProperty = new DerivedProperty(
      [ currentSourceProperty, dcPowerSupply.normalizedCurrentProperty, acPowerSupply.normalizedCurrentProperty ],
      ( currentSource, dcNormalizedCurrent, acNormalizedCurrent ) =>
        ( currentSource === dcPowerSupply ) ? dcNormalizedCurrent : acNormalizedCurrent, {
        isValidValue: normalizedCurrent => FELConstants.NORMALIZED_CURRENT_RANGE.contains( normalizedCurrent ),
        tandem: coilTandem.createTandem( 'normalizedCurrentProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: FELConstants.NORMALIZED_CURRENT_PHET_IO_DOCUMENTATION
      } );

    const coil = new Coil( normalizedCurrentProperty, FELConstants.NORMALIZED_CURRENT_RANGE, currentFlowProperty, {
      maxLoopArea: 7854, // to match Java version
      loopAreaPercentRange: new RangeWithValue( 100, 100, 100 ), // fixed loop area
      numberOfLoopsRange: new RangeWithValue( 1, 4, 4 ),
      loopSpacing: 0, // tightly packed
      tandem: coilTandem
    } );

    // As we said in the Java version... This is a bit of a "fudge". Strength of the magnet is proportional to its EMF.
    const strengthProperty = new DerivedProperty(
      [ coil.numberOfLoopsProperty, coil.numberOfLoopsProperty.rangeProperty, normalizedCurrentProperty ],
      ( numberOfLoops, numberOfLoopsRange, normalizedCurrent ) => {
        const amplitude = Math.abs( ( numberOfLoops / numberOfLoopsRange.max ) * normalizedCurrent );
        return amplitude * FELConstants.MAGNET_STRENGTH_RANGE.max;
      }, {
        units: 'G',
        isValidValue: strength => FELConstants.MAGNET_STRENGTH_RANGE.contains( strength ),
        tandem: options.tandem.createTandem( 'strengthProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true
      } );

    super( coil, strengthProperty, FELConstants.MAGNET_STRENGTH_RANGE, options );

    this.coil = coil;
    this.dcPowerSupply = dcPowerSupply;
    this.acPowerSupply = acPowerSupply;
    this.currentSourceProperty = currentSourceProperty;

    // Polarity is determined by the sign of the normalized current.
    assert && assert( FELConstants.NORMALIZED_CURRENT_RANGE.min < 0 && FELConstants.NORMALIZED_CURRENT_RANGE.max > 0,
      'normalizedCurrentProperty listener assumes that range is signed' );
    this.coil.normalizedCurrentProperty.link( normalizedCurrent => {
      this.rotationProperty.value = ( normalizedCurrent >= 0 ) ? 0 : Math.PI;
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
    // Do not reset Properties documented as 'DEBUG' above.
  }

  public step( dt: number ): void {
    if ( this.currentSourceProperty.value === this.acPowerSupply ) {
      this.acPowerSupply.step( dt );
    }
    this.coil.step( dt );
  }
}

faradaysElectromagneticLab.register( 'Electromagnet', Electromagnet );