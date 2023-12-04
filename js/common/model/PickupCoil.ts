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

const WIRE_WIDTH = 16;
const LOOP_SPACING = 1.5 * WIRE_WIDTH; // loosely packed loops

type SelfOptions = {
  calibrationEMF: number; //TODO document
  transitionSmoothingScale?: number; //TODO document
  samplePointsStrategy?: SamplePointsStrategy; //TODO document
};

export type PickupCoilOptions = SelfOptions &
  StrictOmit<CoilOptions, 'numberOfLoopsRange' | 'loopRadiusRange' | 'wireWidth' | 'loopSpacing'>;

export default class PickupCoil extends Coil {

  private readonly magnet: Magnet;
  private readonly calibrationEMF: number;
  private readonly transitionSmoothingScale: number;
  private readonly samplePointsStrategy: SamplePointsStrategy;

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

    assert && assert( options.calibrationEMF >= 1, `invalid calibrationEMF: ${options.calibrationEMF} ` );
    assert && assert( options.transitionSmoothingScale > 0 && options.transitionSmoothingScale <= 1,
      `invalid transitionSmoothingScale: ${options.transitionSmoothingScale} ` );

    super( options );

    this.magnet = magnet;
    this.calibrationEMF = options.calibrationEMF;
    this.transitionSmoothingScale = options.transitionSmoothingScale;
    this.samplePointsStrategy = options.samplePointsStrategy;

    //TODO lots more to port from PickupCoil.java
  }

  public override reset(): void {
    super.reset();
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
    assert && assert( numberOfSamplePoints > 0 && numberOfSamplePoints % 2 === 1, `invalid numberOfSamplePoints=${numberOfSamplePoints}` );
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