// Copyright 2023-2024, University of Colorado Boulder

/**
 * Electron is the model of an electron that moves through a coil. The path through the coil is described by
 * an ordered set of CoilSegment instances, each of which is a segment of the coil.
 *
 * Note that Electron and its Properties are NOT instrumented for PhET-iO. The exact positions of electrons
 * are not significant. We do not care (for example) if electron position are different in the Upstream and
 * Downstream frames of the State wrapper. What does matter is the number of electrons and their speed, both
 * of which are computed based on other state.
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
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import FELConstants from '../FELConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import ConstantDtClock from './ConstantDtClock.js';

// Maximum distance along a coil segment that can be traveled in one clock tick.
const MAX_COIL_SEGMENT_POSITION_DELTA = 0.15;
const COIL_SEGMENT_POSITION_RANGE = new Range( 0, 1 );
const MAX_SPEED_AND_DIRECTION = 1;

type SelfOptions = {

  // Ordered collection of the curves that make up the coil
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

  // Electron's position, relative to the coil's position
  public readonly positionProperty: TReadOnlyProperty<Vector2>;
  private readonly _positionProperty: Property<Vector2>;

  // Ordered collection of the segments that make up the coil
  private readonly coilSegments: CoilSegment[];

  // Index of the coil segment that the electron currently occupies
  public readonly coilSegmentIndexProperty: TReadOnlyProperty<number>;
  private readonly _coilSegmentIndexProperty: NumberProperty;

  // Electron's position [0,1] along the coil segment that it occupies: 0=endPoint, 1=startPoint
  private coilSegmentPosition: number;

  // Electron's speed & direction [-1,1], where direction is indicated by sign
  private readonly speedAndDirectionProperty: TReadOnlyProperty<number>;
  private readonly speedAndDirectionRange: Range;

  // Scale for adjusting speed.
  private readonly speedScaleProperty: TReadOnlyProperty<number>;

  // Reusable Vector2 instances
  public readonly reusablePosition1: Vector2;
  public readonly reusablePosition2: Vector2;

  private readonly disposeElectron: () => void;

  public constructor( currentAmplitudeProperty: TReadOnlyProperty<number>, currentAmplitudeRange: Range, providedOptions: ElectronOptions ) {

    const options = providedOptions;
    assert && assert( COIL_SEGMENT_POSITION_RANGE.contains( options.coilSegmentPosition ) );

    this.reusablePosition1 = new Vector2( 0, 0 );
    this.reusablePosition2 = new Vector2( 0, 0 );

    const coilSegment = options.coilSegments[ options.coilSegmentIndex ];
    const initialPosition = coilSegment.curve.evaluate( options.coilSegmentPosition, this.reusablePosition1 );

    this._positionProperty = new Vector2Property( initialPosition );
    this.positionProperty = this._positionProperty;

    this.coilSegments = options.coilSegments;

    this._coilSegmentIndexProperty = new NumberProperty( options.coilSegmentIndex, {
      range: new Range( 0, this.coilSegments.length - 1 )
    } );
    this.coilSegmentIndexProperty = this._coilSegmentIndexProperty;

    this.coilSegmentPosition = options.coilSegmentPosition;

    // Adjust speed and direction based on the current in the coil.
    this.speedAndDirectionRange = new Range( -MAX_SPEED_AND_DIRECTION, MAX_SPEED_AND_DIRECTION );
    this.speedAndDirectionProperty = new DerivedProperty( [ currentAmplitudeProperty ],
      currentAmplitude => {
        if ( Math.abs( currentAmplitude ) < FELConstants.CURRENT_AMPLITUDE_THRESHOLD ) {

          // Current below the threshold results in no motion.
          return 0;
        }
        else {

          // Map currentAmplitudeRange to speedAndDirection.
          return Utils.linear( currentAmplitudeRange.min, currentAmplitudeRange.max,
            this.speedAndDirectionRange.min, this.speedAndDirectionRange.max, currentAmplitude );
        }
      }, {
        isValidValue: value => this.speedAndDirectionRange.contains( value )
      } );

    this.speedScaleProperty = options.speedScaleProperty;

    this.disposeElectron = () => {
      this.positionProperty.dispose();
      this.speedAndDirectionProperty.dispose();
    };
  }

  public dispose(): void {
    this.disposeElectron();
  }

  /**
   * Gets a CoilSegment by index. If no index is provided, get the CoilSegment that the electron currently occupies.
   */
  public getCoilSegment( coilSegmentIndex?: number ): CoilSegment {
    if ( coilSegmentIndex === undefined ) {
      coilSegmentIndex = this._coilSegmentIndexProperty.value;
    }
    return this.coilSegments[ coilSegmentIndex ];
  }

  /**
   * Gets the speed scale for the CoilSegment that the electron currently occupies.
   */
  private getCoilSegmentSpeedScale(): number {
    return this.coilSegments[ this._coilSegmentIndexProperty.value ].speedScale;
  }

  /**
   * Moves the electron along the path.
   *
   * The electron's path is described by the CoilSegment array.
   *
   * The electron's speed & direction determine its position along a curve. Speed is scaled to account for possible
   * differences in the lengths of the curves. Shorter curves will have a larger scaling factor.
   *
   * When an electron gets to the end of the current curve, it jumps to the next curve, to a point that represents
   * the "overshoot". The order of curves is determined by the order of elements in the CoilSegment array.
   */
  public step( dt: number ): void {
    assert && assert( dt === ConstantDtClock.DT, `invalid dt=${dt}` );

    if ( this.speedAndDirectionProperty.value !== 0 ) {

      // Move the electron along the path.
      const deltaPosition = dt * MAX_COIL_SEGMENT_POSITION_DELTA * this.speedAndDirectionProperty.value *
                            this.speedScaleProperty.value * this.getCoilSegmentSpeedScale();
      const newPosition = this.coilSegmentPosition - deltaPosition;

      // Do we need to switch curves?
      if ( newPosition <= 0 || newPosition >= 1 ) {
        this.switchCurves( newPosition );
      }
      else {
        this.coilSegmentPosition = newPosition;
      }
      assert && assert( COIL_SEGMENT_POSITION_RANGE.contains( this.coilSegmentPosition ) );

      // Evaluate the quadratic to determine the electron's position relative to the segment.
      // Use a different reusable Vector2 each time that curve.evaluate is called, so that
      const coilSegment = this.coilSegments[ this._coilSegmentIndexProperty.value ];
      const returnValue = ( this._positionProperty.value === this.reusablePosition1 ) ? this.reusablePosition2 : this.reusablePosition1;
      this._positionProperty.value = coilSegment.curve.evaluate( this.coilSegmentPosition, returnValue );
    }
  }

  /**
   * Moves the electron to an appropriate point on the next/previous curve. Rescales any "overshoot" of position so
   * the distance moved looks approximately the same when moving between curves that have different lengths.
   *
   * If curves have different lengths, it is possible that we may totally skip a curve.This is handled via
   * recursive calls to switchCurves.
   */
  private switchCurves( coilSegmentPosition: number, recursionDepth = 0 ): void {
    assert && assert( recursionDepth < this.coilSegments.length, `infinite loop? recursionDepth=${recursionDepth}` );

    const oldPathSpeedScale = this.getCoilSegmentSpeedScale();

    if ( coilSegmentPosition <= 0 ) {

      // We've passed the end point, so move to the next curve. Wrap around if necessary.
      const coilSegmentIndex = this._coilSegmentIndexProperty.value + 1;
      if ( coilSegmentIndex > this.coilSegments.length - 1 ) {
        this._coilSegmentIndexProperty.value = 0;
      }
      else {
        this._coilSegmentIndexProperty.value = coilSegmentIndex;
      }

      // Set the position on the curve.
      const overshoot = Math.abs( coilSegmentPosition * this.getCoilSegmentSpeedScale() / oldPathSpeedScale );
      coilSegmentPosition = 1.0 - overshoot;

      // Did we overshoot the curve? If so, call this method recursively.
      if ( coilSegmentPosition < 0.0 ) {
        this.switchCurves( coilSegmentPosition, ++recursionDepth );
      }
      else {
        this.coilSegmentPosition = coilSegmentPosition;
      }
    }
    else if ( coilSegmentPosition >= 1.0 ) {

      // We've passed the start point, so move to the previous curve. Wrap around if necessary.
      const coilSegmentIndex = this._coilSegmentIndexProperty.value - 1;
      if ( coilSegmentIndex < 0 ) {
        this._coilSegmentIndexProperty.value = this.coilSegments.length - 1;
      }
      else {
        this._coilSegmentIndexProperty.value = coilSegmentIndex;
      }

      // Set the position on the curve.
      coilSegmentPosition = Math.abs( ( 1 - coilSegmentPosition ) * this.getCoilSegmentSpeedScale() / oldPathSpeedScale );

      // Did we overshoot the curve? If so, call this method recursively.
      if ( coilSegmentPosition > 1.0 ) {
        this.switchCurves( coilSegmentPosition, ++recursionDepth );
      }
      else {
        this.coilSegmentPosition = coilSegmentPosition;
      }
    }
  }
}

faradaysElectromagneticLab.register( 'Electron', Electron );