// Copyright 2023-2024, University of Colorado Boulder

/**
 * Coil is the model of a coil of wire, with a current flowing through it.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Range from '../../../../dot/js/Range.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FELConstants from '../FELConstants.js';
import CoilSegment from './CoilSegment.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import QuadraticBezierSpline from './QuadraticBezierSpline.js';
import { LinearGradient, TColor } from '../../../../scenery/js/imports.js';
import FELColors from '../FELColors.js';

// Space between electrons, determines the number of electrons add to each curve.
const ELECTRON_SPACING = 25;
const ELECTRONS_IN_LEFT_END = 2;
const ELECTRONS_IN_RIGHT_END = 2;

type StepListener = ( dt: number ) => void;

type SelfOptions = {

  // range and initial value for numberOfLoopsProperty
  numberOfLoopsRange: RangeWithValue;

  // Maximum value of loopAreaProperty, unitless
  maxLoopArea: number;

  // range and initial value of loopAreaPercentProperty
  loopAreaPercentRange: RangeWithValue;

  // the width of the wire that makes up the coil
  wireWidth?: number;

  // Horizontal spacing between loops in the coil. Values that are closer to wireWidth result in more closely-packed loops.
  loopSpacing?: number;

  // Initial value of electronSpeedScaleProperty, a developer control.
  electronSpeedScale?: number;
};

export type CoilOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Coil extends PhetioObject {

  // This is a quantity that PhET made up. It is a percentage [-1,1] that describes the amount of current relative to
  // some maximum current in the model, and the sign indicates the direction of that current. View components can use
  // this value to determine how they should behave -- eg, how far to move a voltmeter needle, how bright to make a
  // light bulb, and how fast to move electrons.
  public readonly currentAmplitudeProperty: TReadOnlyProperty<number>;
  public readonly currentAmplitudeRange: Range;

  // Width of the wire that makes up the coil.
  public readonly wireWidth: number;

  // Horizontal spacing between loops in the coil. Values that are closer to wireWidth result in more closely-packed loops.
  public readonly loopSpacing: number;

  // Number of loops in the coil
  public readonly numberOfLoopsProperty: NumberProperty;

  // Area of one loop
  public readonly loopAreaPercentProperty: NumberProperty;
  public readonly loopAreaProperty: TReadOnlyProperty<number>;
  private readonly maxLoopArea: number;

  // Whether electrons are visible in the coil in the view
  public readonly electronsVisibleProperty: Property<boolean>;

  // DEBUG: Writeable via developer controls only, when running with &dev query parameter.
  // Scale used for electron speed in the view.
  public readonly electronSpeedScaleProperty: NumberProperty;

  // Called by step method
  private readonly stepListeners: StepListener[];

  // Segments that describe the shape of the coil
  public readonly coilSegmentsProperty: TReadOnlyProperty<CoilSegment[]>;

  public constructor( currentAmplitudeProperty: TReadOnlyProperty<number>, currentAmplitudeRange: Range, providedOptions: CoilOptions ) {
    assert && assert( currentAmplitudeRange.equals( FELConstants.CURRENT_AMPLITUDE_RANGE ) );

    const options = optionize<CoilOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      wireWidth: 16,
      loopSpacing: 25,
      electronSpeedScale: 1,

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    assert && assert( options.loopSpacing >= options.wireWidth );

    super( options );

    this.currentAmplitudeProperty = currentAmplitudeProperty;
    this.currentAmplitudeRange = currentAmplitudeRange;

    this.wireWidth = options.wireWidth;
    this.loopSpacing = options.loopSpacing;
    this.maxLoopArea = options.maxLoopArea;
    this.stepListeners = [];

    this.numberOfLoopsProperty = new NumberProperty( options.numberOfLoopsRange.defaultValue, {
      numberType: 'Integer',
      range: options.numberOfLoopsRange,
      tandem: options.tandem.createTandem( 'numberOfLoopsProperty' ),
      phetioFeatured: true
    } );

    // Loop area is a fixed value if the range's min and max are the same.
    const hasFixedLoopArea = ( options.loopAreaPercentRange.getLength() === 0 );

    this.loopAreaPercentProperty = new NumberProperty( options.loopAreaPercentRange.defaultValue, {
      range: options.loopAreaPercentRange,
      units: '%',
      tandem: hasFixedLoopArea ? Tandem.OPT_OUT : options.tandem.createTandem( 'loopAreaPercentProperty' ),
      phetioFeatured: true
    } );

    const loopAreaRange = new Range( ( this.loopAreaPercentProperty.range.min / 100 ) * this.maxLoopArea,
      ( this.loopAreaPercentProperty.range.max / 100 ) * this.maxLoopArea );

    this.loopAreaProperty = new DerivedProperty( [ this.loopAreaPercentProperty ],
      loopAreaPercent => ( loopAreaPercent / 100 ) * this.maxLoopArea, {
        isValidValue: loopArea => loopAreaRange.contains( loopArea ),
        tandem: options.tandem.createTandem( 'loopAreaProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: hasFixedLoopArea ? 'Loop area is fixed.' : 'To change loop area, use loopAreaPercentProperty.'
      } );

    this.electronsVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'electronsVisibleProperty' ),
      phetioFeatured: true
    } );

    this.electronSpeedScaleProperty = new NumberProperty( options.electronSpeedScale, {
      range: new Range( 1, 100 )
      // Do not instrument. This is a PhET developer Property.
    } );

    this.coilSegmentsProperty = new DerivedProperty(
      [ this.numberOfLoopsProperty, this.loopAreaPercentProperty, FELColors.coilFrontColorProperty, FELColors.coilMiddleColorProperty, FELColors.coilBackColorProperty ],
      ( numberOfLoops, loopAreaPercent, frontColor, middleColor, backColor ) =>
        this.createCoilSegments( frontColor, middleColor, backColor ) );
  }

  public reset(): void {
    this.numberOfLoopsProperty.reset();
    this.loopAreaPercentProperty.reset();
    this.electronsVisibleProperty.reset();
    // Do not reset Properties documented as 'DEBUG' above.
  }

  public step( dt: number ): void {
    this.stepListeners.forEach( stepListener => stepListener( dt ) );
  }

  /**
   * Adds a listener that will be called when the step method is called. This was added to keep all stepping in
   * the model, and is used by CoilNode. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/72.
   */
  public addStepListener( stepListener: StepListener ): void {
    this.stepListeners.push( stepListener );
  }

  /**
   * Gets the radius of one loop of the coil.
   */
  public getLoopRadius(): number {
    const loopArea = ( this.loopAreaPercentProperty.value / 100 ) * this.maxLoopArea;
    return Math.sqrt( loopArea / Math.PI );
  }

  /**
   * Gets the minimum radius of one loop of the coil.
   */
  public getMinLoopRadius(): number {
    const minLoopArea = ( this.loopAreaPercentProperty.range.min / 100 ) * this.maxLoopArea;
    return Math.sqrt( minLoopArea / Math.PI );
  }

  /**
   * Creates the segments that describe the shape of the coil.
   */
  private createCoilSegments( frontColor: TColor, middleColor: TColor, backColor: TColor ): CoilSegment[] {

    const coilSegments: CoilSegment[] = [];

    // Get some coil model values, to improve code readability.
    const radius = this.getLoopRadius();
    const numberOfLoops = this.numberOfLoopsProperty.value;
    const loopSpacing = this.loopSpacing;

    // Start at the left-most loop, keeping the coil centered.
    const xStart = -( loopSpacing * ( numberOfLoops - 1 ) / 2 );

    // Create the wire ends & loops from left to right.
    // Segments are created in the order that they are pieced together.
    for ( let i = 0; i < numberOfLoops; i++ ) {

      const xOffset = xStart + ( i * loopSpacing );

      // For the left-most loop...
      if ( i === 0 ) {

        // Left wire end in background
        {
          const endPoint = new Vector2( -loopSpacing / 2 + xOffset, -radius ); // lower
          const startPoint = new Vector2( endPoint.x - 15, endPoint.y - 40 ); // upper
          const controlPoint = new Vector2( endPoint.x - 20, endPoint.y - 20 );
          const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

          // Horizontal gradient, left to right.
          const gradient = new LinearGradient( startPoint.x, 0, endPoint.x, 0 )
            .addColorStop( 0, middleColor )
            .addColorStop( 1, backColor );

          const coilSegment = new CoilSegment( curve, 'background', {
            stroke: gradient,

            // Scale the speed, since this segment is different from the others in the coil.
            speedScale: ( radius / ELECTRON_SPACING ) / ELECTRONS_IN_LEFT_END
          } );
          coilSegments.push( coilSegment );
        }

        // Back top (left-most) is slightly different, because it connects to the left wire end.
        {
          const startPoint = new Vector2( -loopSpacing / 2 + xOffset, -radius ); // upper
          const endPoint = new Vector2( ( radius * 0.25 ) + xOffset, 0 ); // lower
          const controlPoint = new Vector2( ( radius * 0.15 ) + xOffset, ( -radius * 0.70 ) );
          const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

          const coilSegment = new CoilSegment( curve, 'background', {
            stroke: backColor
          } );
          coilSegments.push( coilSegment );
        }
      }
      else {

        // Back top (no wire end connection)
        const startPoint = new Vector2( -loopSpacing + xOffset, -radius ); // upper
        const endPoint = new Vector2( ( radius * 0.25 ) + xOffset, 0 ); // lower
        const controlPoint = new Vector2( ( radius * 0.15 ) + xOffset, ( -radius * 1.20 ) );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        // Diagonal gradient, upper left to lower right.
        const gradient = new LinearGradient( startPoint.x + ( radius * 0.10 ), -radius, xOffset, -radius * 0.92 )
          .addColorStop( 0, middleColor )
          .addColorStop( 1, backColor );

        const coilSegment = new CoilSegment( curve, 'background', {
          stroke: gradient
        } );
        coilSegments.push( coilSegment );
      }

      // Back bottom
      {
        const startPoint = new Vector2( ( radius * 0.25 ) + xOffset, 0 ); // upper
        const endPoint = new Vector2( xOffset, radius ); // lower
        const controlPoint = new Vector2( ( radius * 0.35 ) + xOffset, ( radius * 1.20 ) );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        // Vertical gradient, upper to lower
        const gradient = new LinearGradient( 0, radius * 0.92, 0, radius )
          .addColorStop( 0, backColor )
          .addColorStop( 1, middleColor );

        const coilSegment = new CoilSegment( curve, 'background', {
          stroke: gradient
        } );
        coilSegments.push( coilSegment );
      }

      // Horizontal gradient, left to right, for the front segments
      const frontGradient = new LinearGradient( ( -radius * 0.25 ) + xOffset, 0, -radius * 0.15 + xOffset, 0 )
        .addColorStop( 0, frontColor )
        .addColorStop( 1, middleColor );

      // Front bottom
      {
        const startPoint = new Vector2( xOffset, radius ); // lower
        const endPoint = new Vector2( ( -radius * 0.25 ) + xOffset, 0 ); // upper
        const controlPoint = new Vector2( ( -radius * 0.25 ) + xOffset, ( radius * 0.80 ) );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        const coilSegment = new CoilSegment( curve, 'foreground', {
          stroke: frontGradient
        } );
        coilSegments.push( coilSegment );
      }

      // Front top
      {
        const startPoint = new Vector2( ( -radius * 0.25 ) + xOffset, 0 ); // lower
        const endPoint = new Vector2( xOffset, -radius ); // upper
        const controlPoint = new Vector2( ( -radius * 0.25 ) + xOffset, ( -radius * 0.80 ) );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        const coilSegment = new CoilSegment( curve, 'foreground', {
          stroke: frontGradient
        } );
        coilSegments.push( coilSegment );
      }

      // For the rightmost loop.... Right wire end in foreground
      if ( i === numberOfLoops - 1 ) {
        const startPoint = new Vector2( xOffset, -radius ); // lower
        const endPoint = new Vector2( startPoint.x + 15, startPoint.y - 40 ); // upper
        const controlPoint = new Vector2( startPoint.x + 20, startPoint.y - 20 );
        const curve = new QuadraticBezierSpline( startPoint, controlPoint, endPoint );

        const coilSegment = new CoilSegment( curve, 'foreground', {
          stroke: middleColor,

          // Scale the speed, since this segment is different from the others in the coil.
          speedScale: ( radius / ELECTRON_SPACING ) / ELECTRONS_IN_RIGHT_END
        } );
        coilSegments.push( coilSegment );
      }
    }
    return coilSegments;
  }
}

faradaysElectromagneticLab.register( 'Coil', Coil );