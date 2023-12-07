// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoil is the model of a pickup coil. Its behavior follows Faraday's Law for electromagnetic induction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Coil, { CoilOptions } from './Coil.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Magnet from './Magnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import { Indicator, IndicatorValues } from './Indicator.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';

const WIRE_WIDTH = 16;
const LOOP_SPACING = 1.5 * WIRE_WIDTH; // loosely packed loops

type SelfOptions = {
  maxEMF: number; // the initial value of maxEMFProperty
  transitionSmoothingScale?: number; // the initial value of transitionSmoothingScaleProperty
  samplePointsStrategy?: SamplePointsStrategy; //TODO document
};

export type PickupCoilOptions = SelfOptions &
  StrictOmit<CoilOptions, 'numberOfLoopsRange' | 'loopRadiusRange' | 'wireWidth' | 'loopSpacing'>;

export default class PickupCoil extends Coil {

  private readonly magnet: Magnet;
  private readonly samplePointsStrategy: SamplePointsStrategy;

  public readonly indicatorProperty: Property<Indicator>;
  public readonly electronsVisibleProperty: Property<boolean>;

  // *** Writeable by developer controls only ***
  // Dividing the coil's emf by this number will give us the coil's current amplitude, a number between 0 and 1 that
  // determines the responsiveness of view components. This number should be set as close as possible to the maximum
  // EMF that can be induced given the range of all model parameters.
  public readonly maxEMFProperty: NumberProperty;

  // *** Writeable by developer controls only ***
  // This is a scaling factor used to smooth out abrupt changes that occur when the magnet transitions between being
  // inside & outside the coil. This is used to scale the B-field for sample points inside the magnet, eliminating
  // abrupt transitions at the left and right edges of the magnet. For any sample point inside the magnet, the B-field
  // sample is multiplied by this value.
  //
  // To set this value, follow these steps:
  // * enable the developer controls for "pickup transition scale" and "display flux"
  // * move the magnet horizontally through the coil until, by moving it one pixel, you see an abrupt change in the
  //   displayed flux value.
  // * note the 2 flux values when the abrupt change occurs
  // * move the magnet so that the larger of the 2 flux values is displayed
  // * adjust the developer control until the larger value is reduced to approximately the same value as the smaller value.
  public readonly transitionSmoothingScaleProperty: NumberProperty;

  // *** Writeable by developer controls only ***
  // Makes the sample points visible in the view
  public readonly samplePointsVisibleProperty: Property<boolean>;

  // *** Writeable by developer controls only ***
  // Makes a flux display visible in the view
  public readonly fluxVisibleProperty: Property<boolean>;

  public constructor( magnet: Magnet, providedOptions: PickupCoilOptions ) {

    const options = optionize<PickupCoilOptions, SelfOptions, CoilOptions>()( {

      // SelfOptions
      transitionSmoothingScale: 1, // no smoothing
      samplePointsStrategy: new ConstantNumberOfSamplePointsStrategy( 9 /* numberOfSamplePoints */ ),

      // CoilOptions
      numberOfLoopsRange: new RangeWithValue( 1, 3, 2 ),
      loopRadiusRange: new RangeWithValue( 68, 150, 109 ),
      wireWidth: WIRE_WIDTH,
      loopSpacing: LOOP_SPACING
    }, providedOptions );

    super( options );

    this.magnet = magnet;

    this.samplePointsStrategy = options.samplePointsStrategy;

    this.indicatorProperty = new StringUnionProperty<Indicator>( 'lightBulb', {
      validValues: IndicatorValues,
      tandem: options.tandem.createTandem( 'indicatorProperty' ),
      phetioFeatured: true
    } );

    this.electronsVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'electronsVisibleProperty' ),
      phetioFeatured: true
    } );

    this.maxEMFProperty = new NumberProperty( options.maxEMF, {
      range: new Range( 10000, 5000000 )
    } );

    this.transitionSmoothingScaleProperty = new NumberProperty( options.transitionSmoothingScale, {
      range: new Range( 0.1, 1 )
    } );

    this.samplePointsVisibleProperty = new BooleanProperty( false );

    this.fluxVisibleProperty = new BooleanProperty( false );

    //TODO lots more to port from PickupCoil.java
  }

  public override reset(): void {
    super.reset();
    this.indicatorProperty.reset();
    this.electronsVisibleProperty.reset();
    //TODO
  }

  public step( dt: number ): void {
    //TODO beware of dependencies on SwingTimer.java !!
  }
}

//TODO This seems like overkill, and should be simplified.
/**
 * SamplePointsStrategy is the abstract base class for a strategy that creates B-field sample points for a pickup coil.
 */
abstract class SamplePointsStrategy {
  public abstract createSamplePoints( pickupCoil: PickupCoil ): Vector2[];
}

/**
 * ConstantNumberOfSamplePointsStrategy has a fixed number of points and variable spacing. The points are distributed
 * along a vertical line that goes through the center of a pickup coil. The number of sample points must be odd, so
 * that one point is at the center of the coil. The points at the outer edge are guaranteed to be on the coil.
 */
class ConstantNumberOfSamplePointsStrategy extends SamplePointsStrategy {

  private readonly numberOfSamplePoints: number;

  public constructor( numberOfSamplePoints: number ) {
    assert && assert( Number.isInteger( numberOfSamplePoints ) && numberOfSamplePoints > 0 && numberOfSamplePoints % 2 === 1,
      `invalid numberOfSamplePoints=${numberOfSamplePoints}, should be an odd integer` );
    super();
    this.numberOfSamplePoints = numberOfSamplePoints;
  }

  public override createSamplePoints( pickupCoil: PickupCoil ): Vector2[] {

    const samplePoints: Vector2[] = [];
    const numberOfSamplePointsOnRadius = ( this.numberOfSamplePoints - 1 ) / 2;
    const ySpacing = pickupCoil.loopRadiusProperty.value / numberOfSamplePointsOnRadius;

    // All sample points share the same x offset.
    const xOffset = 0;

    // A point a the center of the coil
    let index = 0;
    samplePoints[ index++ ] = new Vector2( xOffset, 0 );

    // Points above and below the center
    let y = 0;
    for ( let i = 0; i < numberOfSamplePointsOnRadius; i++ ) {
      y += ySpacing;
      samplePoints[ index++ ] = new Vector2( xOffset, y );
      samplePoints[ index++ ] = new Vector2( xOffset, -y );
    }

    return samplePoints;
  }
}

/**
 * VariableNumberOfSamplePointsStrategy has a fixed spacing and variable number of points. Points are distributed along
 * a vertical line that goes through the center of a pickup coil. One point is at the center of the coil. Points will
 * be on the edge of the coil only if the coil's radius is an integer multiple of the spacing.
 */
export class VariableNumberOfSamplePointsStrategy extends SamplePointsStrategy {

  private readonly ySpacing: number;

  public constructor( ySpacing: number ) {
    assert && assert( ySpacing > 0, `invalid ySpacing=${ySpacing}` );
    super();
    this.ySpacing = ySpacing;
  }

  public override createSamplePoints( pickupCoil: PickupCoil ): Vector2[] {

    const numberOfSamplePointsOnRadius = Math.trunc( pickupCoil.loopRadiusProperty.value / this.ySpacing );

    const samplePoints: Vector2[] = [];

    // All sample points share the same x offset.
    const xOffset = 0;

    // A point a the center of the coil
    let index = 0;
    samplePoints[ index++ ] = new Vector2( xOffset, 0 );

    // Offsets below & above the center
    let y = 0;
    for ( let i = 0; i < numberOfSamplePointsOnRadius; i++ ) {
      y += this.ySpacing;
      samplePoints[ index++ ] = new Vector2( xOffset, y );
      samplePoints[ index++ ] = new Vector2( xOffset, -y );
    }

    return samplePoints;
  }
}


faradaysElectromagneticLab.register( 'PickupCoil', PickupCoil );