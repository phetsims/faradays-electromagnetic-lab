// Copyright 2023-2024, University of Colorado Boulder

/**
 * Electron is the model of an electron that moves through a coil. The path through the coil is described by
 * an ordered set of CoilSegment instances, each of which is a segment of the coil.
 *
 * Note that Electron is NOT instrumented for PhET-iO. The exact positions of electrons are not significant.
 * We do not care (for example) if electron positions are different in the Upstream and Downstream frames of
 * the State wrapper. What does matter is the number of electrons and their speed, both of which are derived
 * from other state.
 *
 * This is based on Electron.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import CoilSegment from './CoilSegment.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import FELConstants from '../FELConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import ConstantDtClock from './ConstantDtClock.js';
import { CoilLayer } from './Coil.js';

// Maximum distance along a coil segment that can be traveled in one clock tick.
const MAX_COIL_SEGMENT_POSITION_DELTA = 0.15;
const COIL_SEGMENT_POSITION_RANGE = new Range( 0, 1 );
const MAX_SPEED_AND_DIRECTION = 1;

type SelfOptions = {

  // Ordered collection of the segments that make up the coil
  coilSegments: CoilSegment[];

  // Initial value of coilSegmentIndexProperty
  coilSegmentIndex: number;

  // Initial value of coilSegmentPosition
  coilSegmentPosition: number;

  // Developer control used to scale the electron speed in the view.
  speedScaleProperty: TReadOnlyProperty<number>;
};

type ElectronOptions = SelfOptions;

export default class Electron {

  // Current that this electron represents.
  private readonly normalizedCurrentProperty: TReadOnlyProperty<number>;
  private readonly normalizedCurrentRange: Range;

  // Electron's position, relative to the coil's position. This Vector2 is mutated as position changes.
  private readonly position: Vector2;

  // Ordered collection of the segments that make up the coil
  private readonly coilSegments: CoilSegment[];

  // Index of the coil segment that the electron currently occupies
  private coilSegmentIndex: number;

  // Electron's position [0,1] along the coil segment that it occupies: 0=endPoint, 1=startPoint
  private coilSegmentPosition: number;

  // Electron's speed & direction [-1,1], where direction is indicated by sign
  private speedAndDirection: number;
  private readonly speedAndDirectionRange: Range;

  // Scale for adjusting speed.
  private readonly speedScaleProperty: TReadOnlyProperty<number>;

  public constructor( normalizedCurrentProperty: TReadOnlyProperty<number>, normalizedCurrentRange: Range, providedOptions: ElectronOptions ) {

    const options = providedOptions;
    assert && assert( COIL_SEGMENT_POSITION_RANGE.contains( options.coilSegmentPosition ) );

    this.normalizedCurrentProperty = normalizedCurrentProperty;
    this.normalizedCurrentRange = normalizedCurrentRange;

    const coilSegment = options.coilSegments[ options.coilSegmentIndex ];

    this.position = coilSegment.evaluate( options.coilSegmentPosition );
    this.coilSegments = options.coilSegments;
    this.coilSegmentIndex = options.coilSegmentIndex;
    this.coilSegmentPosition = options.coilSegmentPosition;
    this.speedAndDirectionRange = new Range( -MAX_SPEED_AND_DIRECTION, MAX_SPEED_AND_DIRECTION );
    this.speedAndDirection = 0;
    this.speedScaleProperty = options.speedScaleProperty;
  }

  public dispose(): void {
    // Nothing to do currently. But this class is allocated dynamically, so keep this method as a bit of defensive programming.
  }

  public get x(): number {
    return this.position.x;
  }

  public get y(): number {
    return this.position.y;
  }

  /**
   * Gets the layer that this electron currently occupies.
   */
  public getLayer(): CoilLayer {
    return this.coilSegments[ this.coilSegmentIndex ].layer;
  }

  /**
   * Gets the speed scale for the CoilSegment that the electron currently occupies.
   */
  private getCoilSegmentSpeedScale(): number {
    return this.coilSegments[ this.coilSegmentIndex ].speedScale;
  }

  /**
   * Moves the electron along the path.
   *
   * The electron's path is described by the CoilSegment array.
   *
   * The electron's speed & direction determine its position along a coil segment. Speed is scaled to account for
   * possible differences in the lengths of the segments. Shorter segments will have a larger scaling factor.
   *
   * When an electron gets to the end of the current segment, it jumps to the next segment, to a point that represents
   * the "overshoot". The order of segments is determined by the order of elements in the CoilSegment array.
   */
  public step( dt: number ): void {
    assert && assert( dt === ConstantDtClock.DT, `invalid dt=${dt}` );

    this.speedAndDirection = this.normalizedCurrentToSpeedAndDirection( this.normalizedCurrentProperty.value );

    if ( this.speedAndDirection !== 0 ) {

      // Move the electron along the path. coilSegmentPosition is 1=start and 0=end, so we subtract the delta here.
      const deltaPosition = dt * MAX_COIL_SEGMENT_POSITION_DELTA * this.speedAndDirection *
                            this.speedScaleProperty.value * this.getCoilSegmentSpeedScale();
      const newPosition = this.coilSegmentPosition - deltaPosition;

      // Do we need to move to the next/previous coil segment?
      if ( newPosition <= 0 || newPosition >= 1 ) {
        this.moveToCoilSegment( newPosition );
      }
      else {
        this.coilSegmentPosition = newPosition;
      }
      assert && assert( COIL_SEGMENT_POSITION_RANGE.contains( this.coilSegmentPosition ) );

      // Get the coil segment that this electron currently occupies.
      const coilSegment = this.coilSegments[ this.coilSegmentIndex ];

      // Evaluate the quadratic to determine the electron's position relative to the segment.
      // Note that this mutates this.position.
      coilSegment.evaluate( this.coilSegmentPosition, this.position );
    }
  }

  /**
   * Maps normalized current in the coil to the electron's speed and direction.
   */
  private normalizedCurrentToSpeedAndDirection( normalizedCurrent: number ): number {
    let speedAndDirection = 0;
    if ( Math.abs( normalizedCurrent ) > FELConstants.NORMALIZED_CURRENT_THRESHOLD ) {
      speedAndDirection = Utils.linear( this.normalizedCurrentRange.min, this.normalizedCurrentRange.max,
        this.speedAndDirectionRange.min, this.speedAndDirectionRange.max, normalizedCurrent );
    }
    return speedAndDirection;
  }

  /**
   * Moves the electron to an appropriate point on the next/previous coil segment. Rescales any "overshoot" of position
   * so the distance moved looks approximately the same when moving between segments that have different lengths.
   * If segments have different lengths, it is possible that we may totally skip a segments. This is handled via
   * recursive calls to moveToCoilSegment.
   */
  private moveToCoilSegment( coilSegmentPosition: number, recursionDepth = 0 ): void {
    assert && assert( recursionDepth < this.coilSegments.length, `infinite loop? recursionDepth=${recursionDepth}` );

    const oldCoilSegmentSpeedScale = this.getCoilSegmentSpeedScale();

    // Reminder: For coilSegmentPosition, 0=endPoint, 1=startPoint.
    if ( coilSegmentPosition <= 0 ) {

      // We've passed the end point, so move to the next segment. Wrap around if necessary.
      const coilSegmentIndex = this.coilSegmentIndex + 1;
      if ( coilSegmentIndex > this.coilSegments.length - 1 ) {
        this.coilSegmentIndex = 0;
      }
      else {
        this.coilSegmentIndex = coilSegmentIndex;
      }

      // Set the position on the coil segment.
      const overshoot = Math.abs( coilSegmentPosition * this.getCoilSegmentSpeedScale() / oldCoilSegmentSpeedScale );
      coilSegmentPosition = 1.0 - overshoot;

      // Did we overshoot? If so, call this method recursively.
      if ( coilSegmentPosition < 0.0 ) {
        this.moveToCoilSegment( coilSegmentPosition, recursionDepth + 1 );
      }
      else {
        this.coilSegmentPosition = coilSegmentPosition;
      }
    }
    else if ( coilSegmentPosition >= 1.0 ) {

      // We've passed the start point, so move to the previous coil segment. Wrap around if necessary.
      const coilSegmentIndex = this.coilSegmentIndex - 1;
      if ( coilSegmentIndex < 0 ) {
        this.coilSegmentIndex = this.coilSegments.length - 1;
      }
      else {
        this.coilSegmentIndex = coilSegmentIndex;
      }

      // Set the position on the coil segment.
      coilSegmentPosition = Math.abs( ( 1 - coilSegmentPosition ) * this.getCoilSegmentSpeedScale() / oldCoilSegmentSpeedScale );

      // Did we overshoot? If so, call this method recursively.
      if ( coilSegmentPosition > 1.0 ) {
        this.moveToCoilSegment( coilSegmentPosition, recursionDepth + 1 );
      }
      else {
        this.coilSegmentPosition = coilSegmentPosition;
      }
    }
  }
}

faradaysElectromagneticLab.register( 'Electron', Electron );