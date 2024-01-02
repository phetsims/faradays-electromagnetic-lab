// Copyright 2023, University of Colorado Boulder

/**
 * Electron is the model of an electron that moves through a coil. The path through the coil is described by
 * an ordered set of CoilSegment elements.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import CoilSegment from './CoilSegment.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

// Maximum distance along a coil segment that can be traveled in one clock tick.
const MAX_COIL_SEGMENT_POSITION_DELTA = 0.15;
const COIL_SEGMENT_POSITION_RANGE = new Range( 0, 1 );

//TODO document
type SelfOptions = {

  // Ordered collection of the curves that make up the coil
  coilSegments: CoilSegment[];

  // Initial value of coilSegmentIndexProperty
  coilSegmentIndex: number;

  // Initial value of coilSegmentPositionProperty
  coilSegmentPosition: number;

  // Initial value of speedAndDirectionProperty
  speedAndDirection: number;

  // Developer control used to scale the electron speed in the view.
  speedScaleProperty: TReadOnlyProperty<number>;

  // Whether electrons are visible.
  visibleProperty: TReadOnlyProperty<boolean>;
};

type ElectronOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Electron {

  public readonly positionProperty: TReadOnlyProperty<Vector2>;
  private readonly _positionProperty: Property<Vector2>;

  // Ordered collection of the curves that make up the coil
  private readonly coilSegments: CoilSegment[];

  // Index of the coil segment that the electron currently occupies
  public readonly coilSegmentIndexProperty: NumberProperty;

  // Electron's position along the coil segment that it occupies (1=startPoint, 0=endPoint)
  //TODO Flip the semantics to be a percent along a coil segment, 0=start, 1=end.
  private coilSegmentPositionProperty: NumberProperty;

  // Electron's speed & direction (-1...+1)
  public readonly speedAndDirectionProperty: NumberProperty;

  // Scale for adjusting speed.
  private readonly speedScaleProperty: TReadOnlyProperty<number>;

  // Whether electrons are visible.
  public readonly visibleProperty: TReadOnlyProperty<boolean>;

  private readonly disposeElectron: () => void;

  public constructor( providedOptions: ElectronOptions ) {
    const options = providedOptions;

    const descriptor = options.coilSegments[ options.coilSegmentIndex ];
    const initialPosition = descriptor.curve.evaluate( options.coilSegmentPosition );
    
    this._positionProperty = new Vector2Property( initialPosition, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioReadOnly: true
    } );
    this.positionProperty = this._positionProperty;

    this.coilSegments = options.coilSegments;

    this.coilSegmentIndexProperty = new NumberProperty( options.coilSegmentIndex, {
      range: new Range( 0, this.coilSegments.length - 1 ),
      tandem: options.tandem.createTandem( 'coilSegmentIndexProperty' ),
      phetioReadOnly: true
    } );

    this.coilSegmentPositionProperty = new NumberProperty( options.coilSegmentPosition, {
      range: COIL_SEGMENT_POSITION_RANGE,
      tandem: options.tandem.createTandem( 'coilSegmentPositionProperty' ),
      phetioReadOnly: true
    } );

    this.speedAndDirectionProperty = new NumberProperty( options.speedAndDirection, {
      range: new Range( -1, 1 ),
      tandem: options.tandem.createTandem( 'speedAndDirectionProperty' ),
      phetioReadOnly: true
    } );

    this.speedScaleProperty = options.speedScaleProperty;
    this.visibleProperty = options.visibleProperty;

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
      coilSegmentIndex = this.coilSegmentIndexProperty.value;
    }
    return this.coilSegments[ coilSegmentIndex ];
  }

  /**
   * Gets the speed scale for the CoilSegment that the electron currently occupies.
   */
  private getCoilSegmentSpeedScale(): number {
    return this.coilSegments[ this.coilSegmentIndexProperty.value ].speedScale;
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
    assert && assert( dt === 1, `invalid dt=${dt}, see FELModel step` );

    if ( this.visibleProperty.value && this.speedAndDirectionProperty.value !== 0 ) {

      // Move the electron along the path.
      const deltaPosition = dt * MAX_COIL_SEGMENT_POSITION_DELTA * this.speedAndDirectionProperty.value *
                            this.speedScaleProperty.value * this.getCoilSegmentSpeedScale();
      const newPosition = this.coilSegmentPositionProperty.value - deltaPosition;

      // Do we need to switch curves?
      if ( newPosition <= 0 || newPosition >= 1 ) {
        this.switchCurves( newPosition );
      }
      else {
        this.coilSegmentPositionProperty.value = newPosition;
      }

      // Evaluate the quadratic to determine xy position.
      const descriptor = this.coilSegments[ this.coilSegmentIndexProperty.value ];
      this._positionProperty.value = descriptor.curve.evaluate( this.coilSegmentPositionProperty.value );
    }
  }

  /**
   * Moves the electron to an appropriate point on the next/previous curve. Rescales any "overshoot" of position so
   * the distance moved looks approximately the same when moving between curves that have different lengths.
   *
   * If curves have different lengths, it is possible that we may totally skip a curve.This is handled via
   * recursive calls to switchCurves.
   */
  private switchCurves( coilSegmentPosition: number ): void {

    const oldPathSpeedScale = this.getCoilSegmentSpeedScale();

    if ( coilSegmentPosition <= 0 ) {

      // We've passed the end point, so move to the next curve. Wrap around if necessary.
      const coilSegmentIndex = this.coilSegmentIndexProperty.value + 1;
      if ( coilSegmentIndex > this.coilSegments.length - 1 ) {
        this.coilSegmentIndexProperty.value = 0;
      }
      else {
        this.coilSegmentIndexProperty.value = coilSegmentIndex;
      }

      // Set the position on the curve.
      const overshoot = Math.abs( coilSegmentPosition * this.getCoilSegmentSpeedScale() / oldPathSpeedScale );
      coilSegmentPosition = 1.0 - overshoot;

      // Did we overshoot the curve? If so, call this method recursively.
      if ( coilSegmentPosition < 0.0 ) {
        this.switchCurves( coilSegmentPosition ); //TODO guard against infinite recursion?
      }
      else {
        this.coilSegmentPositionProperty.value = coilSegmentPosition;
      }
    }
    else if ( coilSegmentPosition >= 1.0 ) {

      // We've passed the start point, so move to the previous curve. Wrap around if necessary.
      const coilSegmentIndex = this.coilSegmentIndexProperty.value - 1;
      if ( coilSegmentIndex < 0 ) {
        this.coilSegmentIndexProperty.value = this.coilSegments.length - 1;
      }
      else {
        this.coilSegmentIndexProperty.value = coilSegmentIndex;
      }

      // Set the position on the curve.
      coilSegmentPosition = Math.abs( ( 1 - coilSegmentPosition ) * this.getCoilSegmentSpeedScale() / oldPathSpeedScale );

      // Did we overshoot the curve? If so, call this method recursively.
      if ( coilSegmentPosition > 1.0 ) {
        this.switchCurves( coilSegmentPosition ); //TODO guard against infinite recursion?
      }
      else {
        this.coilSegmentPositionProperty.value = coilSegmentPosition;
      }
    }
  }
}

faradaysElectromagneticLab.register( 'Electron', Electron );