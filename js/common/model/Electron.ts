// Copyright 2023, University of Colorado Boulder

/**
 * Electron is the model of an electron that moves through a coil. The path through the coil is described by
 * an ordered set of ElectronPathDescriptor elements.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import ElectronPathDescriptor from './ElectronPathDescriptor.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

// Maximum distance along a path that can be traveled in one clock tick.
const MAX_PATH_POSITION_DELTA = 0.15;

type SelfOptions = {
  pathDescriptors: ElectronPathDescriptor[];
  pathPosition: number;
  pathIndex: number;
  speedAndDirection: number;
  speedScaleProperty: TReadOnlyProperty<number>;
  visibleProperty: TReadOnlyProperty<boolean>;
};

type ElectronOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Electron {

  public readonly positionProperty: TReadOnlyProperty<Vector2>;
  private readonly _positionProperty: Property<Vector2>;

  // Describes the electron's path.
  private readonly pathDescriptors: ElectronPathDescriptor[];

  // Index of the element in pathDescriptors that describes the curve the electron is currently on.
  public pathIndex: number;

  // Electron's position along the current curve (1=startPoint, 0=endPoint)
  //TODO Flip the semantics to be a percent along the path, 0=start, 1=end.
  private pathPosition: number;

  // Electron's speed & direction (-1...+1)
  public readonly speedAndDirectionProperty: NumberProperty;

  // Scale for adjusting speed.
  private readonly speedScaleProperty: TReadOnlyProperty<number>;

  // Whether electrons are visible.
  public readonly visibleProperty: TReadOnlyProperty<boolean>;

  private readonly disposeElectron: () => void;

  public constructor( providedOptions: ElectronOptions ) {
    const options = providedOptions;

    assert && assert( Number.isInteger( options.pathIndex ) && options.pathIndex >= 0 && options.pathIndex <= options.pathDescriptors.length - 1,
      `invalid pathIndex: ${options.pathIndex}` );
    assert && assert( options.pathPosition >= 0 && options.pathPosition <= 1,
      `invalid pathPosition: ${options.pathPosition}` );

    this._positionProperty = new Vector2Property( new Vector2( 0, 0 ), {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );
    this.positionProperty = this._positionProperty;

    this.pathDescriptors = options.pathDescriptors;
    this.pathIndex = options.pathIndex;
    this.pathPosition = options.pathPosition;

    this.speedAndDirectionProperty = new NumberProperty( options.speedAndDirection, {
      range: new Range( -1, 1 ),
      tandem: options.tandem.createTandem( 'speedAndDirectionProperty' )
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

  public getPathDescriptor(): ElectronPathDescriptor {
    return this.pathDescriptors[ this.pathIndex ];
  }

  /**
   * Moves the electron along the path.
   *
   * The electron's path is described by the ElectronPathDescriptor array.
   *
   * The electron's speed & direction determine its position along a curve. Speed is scaled to account for possible
   * differences in the lengths of the curves. Shorter curves will have a larger scaling factor.
   *
   * When an electron gets to the end of the current curve, it jumps to the next curve, to a point that represents
   * the "overshoot". The order of curves is determined by the order of elements in the ElectronPathDescriptor array.
   */
  public step( dt: number ): void {
    if ( this.visibleProperty.value && this.speedAndDirectionProperty.value !== 0 ) {

      // Move the electron along the path.
      const speedScale = this.pathDescriptors[ this.pathIndex ].speedScale;
      const deltaPosition = dt * MAX_PATH_POSITION_DELTA * this.speedAndDirectionProperty.value *
                            this.speedScaleProperty.value * speedScale;
      this.pathPosition -= deltaPosition;

      // Do we need to switch curves?
      if ( this.pathPosition <= 0 || this.pathPosition >= 1 ) {
        this.switchCurves();
      }
      assert && assert( this.pathPosition >= 0 && this.pathPosition <= 1,
        `invalid pathPosition: ${this.pathPosition}` );

      // Evaluate the quadratic to determine XY location.
      const descriptor = this.pathDescriptors[ this.pathIndex ];
      this._positionProperty.value = descriptor.curve.evaluate( this.pathPosition );
    }
  }

  /**
   * Moves the electron to an appropriate point on the next/previous curve.
   * Rescales any "overshoot" of position so the distance moved looks
   * approximately the same when moving between curves that have different
   * lengths.
   * <p>
   * If curves have different lengths, it is possible that we may totally
   * skip a curve.  This is handled via recursive calls to switchCurves.
   */
  private switchCurves(): void {

    const oldSpeedScale = this.pathDescriptors[ this.pathIndex ].speedScale;

    if ( this.pathPosition <= 0 ) {

      // We've passed the end point, so move to the next curve.
      this.pathIndex++;
      if ( this.pathIndex > this.pathDescriptors.length - 1 ) {
        this.pathIndex = 0;
      }

      // Set the position on the curve.
      const newSpeedScale = this.pathDescriptors[ this.pathIndex ].speedScale;
      const overshoot = Math.abs( this.pathPosition * newSpeedScale / oldSpeedScale );
      this.pathPosition = 1.0 - overshoot;

      // Did we overshoot the curve? If so, call this method recursively.
      if ( this.pathPosition < 0.0 ) {
        this.switchCurves();
      }
    }
    else if ( this.pathPosition >= 1.0 ) {

      // We've passed the start point, so move to the previous curve.
      this.pathIndex--;
      if ( this.pathIndex < 0 ) {
        this.pathIndex = this.pathDescriptors.length - 1;
      }

      // Set the position on the curve.
      const newSpeedScale = this.pathDescriptors[ this.pathIndex ].speedScale;
      const overshoot = Math.abs( ( 1 - this.pathPosition ) * newSpeedScale / oldSpeedScale );
      this.pathPosition = overshoot;

      // Did we overshoot the curve? If so, call this method recursively.
      if ( this.pathPosition > 1.0 ) {
        this.switchCurves();
      }
    }
    assert && assert( Number.isInteger( this.pathIndex ) && this.pathIndex >= 0 && this.pathIndex <= this.pathDescriptors.length - 1,
      `invalid pathIndex: ${this.pathIndex}` );
    assert && assert( this.pathPosition >= 0 && this.pathPosition <= 1,
      `invalid pathPosition: ${this.pathPosition}` );
  }
}

faradaysElectromagneticLab.register( 'Electron', Electron );