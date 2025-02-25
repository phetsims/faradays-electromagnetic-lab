// Copyright 2023-2025, University of Colorado Boulder

/**
 * Coil is the model of a coil of wire, with a current flowing through it.
 *
 * The coil is described as an array of CoilSegment, which form a set of loops which are not connected at the ends.
 * The ends of the coil are short wire segments (also implemented by CoilSegment) where things can be connected to the
 * coil (eg, lightbulb, voltmeter, power supply). You can easily visualize the ends by changing their stroke color in
 * createCoilSegments.
 *
 * The CoilSegments describe the coil's shape, and the path that charges follow as they flow through the coil,
 * move between layers (foreground or background), and adjust ("scale") their speed so that they appear to flow
 * at the same rate in all coil segments.
 *
 * This is based on Coil.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELColors from '../FELColors.js';
import FELConstants from '../FELConstants.js';
import { CurrentFlow } from '../FELQueryParameters.js';
import ChargedParticle from './ChargedParticle.js';
import CoilSegment from './CoilSegment.js';

// Spacing between the centers of charges in the coil.
const CHARGE_SPACING = 25;

// Ends of the coil contain a fixed number of charges.
const CHARGES_IN_LEFT_END = 2;
const CHARGES_IN_RIGHT_END = 2;

// To provide a pseudo-3D view, so that objects may appear to pass 'through' the coil, the coil is divided into
// foreground and background layers that are rendered separately.
export type CoilLayer = 'foreground' | 'background';

type SelfOptions = {

  // range and initial value for numberOfLoopsProperty
  numberOfLoopsRange: RangeWithValue;

  // Maximum value of loopAreaProperty, unitless
  maxLoopArea: number;

  // range and initial value of loopAreaPercentProperty
  loopAreaPercentRange: RangeWithValue;

  // the width of the wire that makes up the coil
  wireWidth?: number;

  // Horizontal spacing between loops in the coil. Zero is tightly packed.
  loopSpacing?: number;

  // Initial value of currentVisibleProperty.
  currentVisible?: boolean;

  // Initial value of currentSpeedScaleProperty, a developer control.
  currentSpeedScale?: number;
};

export type CoilOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Coil extends PhetioObject {

  // Normalized current is a value in the range [-1,1]. The magnitude describes the amount of current relative to the
  // maximum current that may be induced in the model. The sign indicates the direction of the current. View components
  // use this value to determine how they should respond to induced current. For example: deflection of the voltmeter
  // needle, brightness of the light bulb, speed and direction of current.
  // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/63
  //
  // In the Java version, this was named currentAmplitudeProperty. Code reviewers pointed out that an amplitude is
  // not a signed quantity, so we renamed it. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/130
  public readonly normalizedCurrentProperty: TReadOnlyProperty<number>;
  private readonly normalizedCurrentRange: Range;

  // Convention for current flow direction.
  public readonly currentFlowProperty: TReadOnlyProperty<CurrentFlow>;

  // Width of the wire that makes up the coil.
  public readonly wireWidth: number;

  // Horizontal spacing between loops in the coil. Zero is tightly packed.
  private readonly loopSpacing: number;

  // Number of loops in the coil
  public readonly numberOfLoopsProperty: NumberProperty;

  // Percent of maximum area for one loop
  public readonly loopAreaPercentProperty: NumberProperty;

  // Area of one loop
  public readonly loopAreaProperty: TReadOnlyProperty<number>;
  public readonly loopAreaRange: Range;

  // Radius of one loop
  public readonly loopRadiusProperty: TReadOnlyProperty<number>;
  public readonly loopRadiusRange: Range;

  // Whether current is visible in the coil in the view
  public readonly currentVisibleProperty: Property<boolean>;

  // DEBUG: Writeable via developer controls only, when running with &dev query parameter.
  // For scaling the speed of current in the coil.
  public readonly currentSpeedScaleProperty: NumberProperty;

  // Segments that describe the shape of the coil, from left to right.
  public readonly coilSegmentsProperty: TReadOnlyProperty<CoilSegment[]>;

  // Charges that represent current flow in the coil
  public readonly chargedParticlesProperty: TReadOnlyProperty<ChargedParticle[]>;

  // Fires after charges have moved.
  public readonly chargedParticlesMovedEmitter: Emitter;

  public constructor( normalizedCurrentProperty: TReadOnlyProperty<number>, normalizedCurrentRange: Range,
                      currentFlowProperty: TReadOnlyProperty<CurrentFlow>, providedOptions: CoilOptions ) {
    assert && assert( normalizedCurrentRange.equals( FELConstants.NORMALIZED_CURRENT_RANGE ) );

    const options = optionize<CoilOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      wireWidth: 16,
      loopSpacing: 8,
      currentSpeedScale: 1,
      currentVisible: true,

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    assert && assert( options.wireWidth >= 0, `invalid wireWidth: ${options.wireWidth}` );
    assert && assert( options.loopSpacing >= 0, `invalid loopSpacing: ${options.loopSpacing}` );

    super( options );

    this.normalizedCurrentProperty = normalizedCurrentProperty;
    this.normalizedCurrentRange = normalizedCurrentRange;
    this.currentFlowProperty = currentFlowProperty;

    this.wireWidth = options.wireWidth;
    this.loopSpacing = options.loopSpacing;

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

    this.loopAreaRange = new Range(
      ( this.loopAreaPercentProperty.range.min / 100 ) * options.maxLoopArea,
      ( this.loopAreaPercentProperty.range.max / 100 ) * options.maxLoopArea
    );

    this.loopAreaProperty = new DerivedProperty( [ this.loopAreaPercentProperty ],
      loopAreaPercent => ( loopAreaPercent / 100 ) * options.maxLoopArea, {
        tandem: options.tandem.createTandem( 'loopAreaProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: hasFixedLoopArea ? 'Loop area is fixed.' : 'To change loop area, use loopAreaPercentProperty.'
      } );

    // Convert range from area to radius: r = sqrt( A / PI )
    this.loopRadiusRange = new Range(
      Math.sqrt( this.loopAreaRange.min / Math.PI ),
      Math.sqrt( this.loopAreaRange.max / Math.PI )
    );

    this.loopRadiusProperty = new DerivedProperty( [ this.loopAreaProperty ],
      loopArea => Math.sqrt( loopArea / Math.PI ) );

    this.currentVisibleProperty = new BooleanProperty( options.currentVisible, {
      tandem: options.tandem.createTandem( 'currentVisibleProperty' ),
      phetioFeatured: true
    } );

    this.currentSpeedScaleProperty = new NumberProperty( options.currentSpeedScale, {
      range: new Range( 0.1, 4 )
      // Do not instrument. This is a PhET developer Property.
    } );

    this.coilSegmentsProperty = new DerivedProperty(
      [ this.numberOfLoopsProperty, this.loopRadiusProperty,
        FELColors.coilFrontColorProperty, FELColors.coilMiddleColorProperty, FELColors.coilBackColorProperty ],
      ( numberOfLoops, loopRadius, frontColor, middleColor, backColor ) =>
        Coil.createCoilSegments( numberOfLoops, loopRadius, this.wireWidth, this.loopSpacing, frontColor, middleColor, backColor ) );

    // When a new set of CoilSegments is created, dispose of the old set.
    this.coilSegmentsProperty.lazyLink( ( newCoilSegments, oldCoilSegments ) =>
      oldCoilSegments.forEach( coilSegment => coilSegment.dispose() ) );

    this.chargedParticlesProperty = new DerivedProperty( [ this.coilSegmentsProperty ],
      coilSegments => this.createChargedParticles( coilSegments ) );

    // When a new set of charges is created, dispose of the old set.
    this.chargedParticlesProperty.lazyLink( ( newChargedParticles, oldChargedParticles ) =>
      oldChargedParticles.forEach( chargedParticle => chargedParticle.dispose() ) );

    this.chargedParticlesMovedEmitter = new Emitter();
  }

  public reset(): void {
    this.numberOfLoopsProperty.reset();
    this.loopAreaPercentProperty.reset();
    this.currentVisibleProperty.reset();
    // Do not reset Properties documented as 'DEBUG' above.
  }

  public step( dt: number ): void {

    // Step the charges if there's current flow in the coil, and the current is visible.
    if ( this.normalizedCurrentProperty.value !== 0 && this.currentVisibleProperty.value ) {
      this.chargedParticlesProperty.value.forEach( charge => charge.step( dt ) );
      this.chargedParticlesMovedEmitter.emit();
    }
  }

  /**
   * Creates the segments that describe the shape of a coil, from left to right.
   *
   * WARNING! This method is particularly complicated. The segments that it creates have been tuned so that all
   * segments are smoothly joined to form a pseudo-3D coil. If you change values, do so with caution, test frequently,
   * and perform a close visual inspection of your changes.
   *
   * Note that there are several 'magic numbers' in this method that were empirically determined long ago in the Java
   * version of this sim. This method ported directly from Java very nicely, and those constants (and the structure
   * of this code) are now almost 20 years old, which is downright elderly in code-years. So rather than disturb things
   * by trying to factor out constants or shared code, it seemed preferable to leave it alone. And note that while
   * the creation of each CoilSegment involves similar patterns, each CoilSegment is significantly different, so the
   * impression of 'duplicated code' is illusionary.
   */
  private static createCoilSegments( numberOfLoops: number, loopRadius: number, wireWidth: number, loopSpacing: number,
                                     frontColor: TColor, middleColor: TColor, backColor: TColor ): CoilSegment[] {

    // Space between the centers of loops.
    const loopCenterSpacing = wireWidth + loopSpacing;

    const coilSegments: CoilSegment[] = [];

    // Start at the left-most loop, keeping the coil centered.
    const xStart = -( loopCenterSpacing * ( numberOfLoops - 1 ) / 2 );

    // Create the wire ends & loops from left to right.
    // Segments are created in the order that they would be visited by charges as current flows.
    for ( let i = 0; i < numberOfLoops; i++ ) {

      const xOffset = xStart + ( i * loopCenterSpacing );

      // For the left-most loop...
      if ( i === 0 ) {

        // Left wire end in background
        {
          const endPoint = new Vector2( -loopCenterSpacing / 2 + xOffset, -loopRadius ); // lower
          const startPoint = new Vector2( endPoint.x - 15, endPoint.y - 40 ); // upper
          const controlPoint = new Vector2( endPoint.x - 20, endPoint.y - 20 );

          // Horizontal gradient, left to right.
          const gradient = new LinearGradient( 0, startPoint.y, 0, endPoint.y )
            .addColorStop( 0, middleColor )
            .addColorStop( 1, backColor );

          const coilSegment = new CoilSegment( startPoint, controlPoint, endPoint, 'background', {
            stroke: gradient,

            // Scale the speed, since this segment is different from the others in the coil.
            speedScale: ( loopRadius / CHARGE_SPACING ) / CHARGES_IN_LEFT_END
          } );
          coilSegments.push( coilSegment );
        }

        // Back top (left-most) is slightly different, because it connects to the left wire end.
        {
          const startPoint = new Vector2( -loopCenterSpacing / 2 + xOffset, -loopRadius ); // upper
          const endPoint = new Vector2( ( loopRadius * 0.25 ) + xOffset, 0 ); // lower
          const controlPoint = new Vector2( ( loopRadius * 0.15 ) + xOffset, ( -loopRadius * 0.70 ) );

          const coilSegment = new CoilSegment( startPoint, controlPoint, endPoint, 'background', {
            stroke: backColor
          } );
          coilSegments.push( coilSegment );
        }
      }
      else {

        // Back top (no wire end connection)
        const startPoint = new Vector2( -loopCenterSpacing + xOffset, -loopRadius ); // upper
        const endPoint = new Vector2( ( loopRadius * 0.25 ) + xOffset, 0 ); // lower
        const controlPoint = new Vector2( ( loopRadius * 0.15 ) + xOffset, ( -loopRadius * 1.20 ) );

        // Diagonal gradient, upper left to lower right.
        const gradient = new LinearGradient( startPoint.x + ( loopRadius * 0.10 ), -loopRadius, xOffset, -loopRadius * 0.92 )
          .addColorStop( 0, middleColor )
          .addColorStop( 1, backColor );

        const coilSegment = new CoilSegment( startPoint, controlPoint, endPoint, 'background', {
          stroke: gradient
        } );
        coilSegments.push( coilSegment );
      }

      // Back bottom
      {
        const startPoint = new Vector2( ( loopRadius * 0.25 ) + xOffset, 0 ); // upper
        const endPoint = new Vector2( xOffset, loopRadius ); // lower
        const controlPoint = new Vector2( ( loopRadius * 0.35 ) + xOffset, ( loopRadius * 1.20 ) );

        // Vertical gradient, upper to lower
        const gradient = new LinearGradient( 0, loopRadius * 0.92, 0, loopRadius )
          .addColorStop( 0, backColor )
          .addColorStop( 1, middleColor );

        const coilSegment = new CoilSegment( startPoint, controlPoint, endPoint, 'background', {
          stroke: gradient
        } );
        coilSegments.push( coilSegment );
      }

      // Horizontal gradient, left to right, for the front segments
      const frontGradient = new LinearGradient( ( -loopRadius * 0.25 ) + xOffset, 0, -loopRadius * 0.15 + xOffset, 0 )
        .addColorStop( 0, frontColor )
        .addColorStop( 1, middleColor );

      // Front bottom
      {
        const startPoint = new Vector2( xOffset, loopRadius ); // lower
        const endPoint = new Vector2( ( -loopRadius * 0.25 ) + xOffset, 0 ); // upper
        const controlPoint = new Vector2( ( -loopRadius * 0.25 ) + xOffset, ( loopRadius * 0.80 ) );

        const coilSegment = new CoilSegment( startPoint, controlPoint, endPoint, 'foreground', {
          stroke: frontGradient
        } );
        coilSegments.push( coilSegment );
      }

      // Front top
      {
        const startPoint = new Vector2( ( -loopRadius * 0.25 ) + xOffset, 0 ); // lower
        const endPoint = new Vector2( xOffset, -loopRadius ); // upper
        const controlPoint = new Vector2( ( -loopRadius * 0.25 ) + xOffset, ( -loopRadius * 0.80 ) );

        const coilSegment = new CoilSegment( startPoint, controlPoint, endPoint, 'foreground', {
          stroke: frontGradient
        } );
        coilSegments.push( coilSegment );
      }

      // For the rightmost loop.... Right wire end in foreground
      if ( i === numberOfLoops - 1 ) {
        const startPoint = new Vector2( xOffset, -loopRadius ); // lower
        const endPoint = new Vector2( startPoint.x + 15, startPoint.y - 40 ); // upper
        const controlPoint = new Vector2( startPoint.x + 20, startPoint.y - 20 );

        const coilSegment = new CoilSegment( startPoint, controlPoint, endPoint, 'foreground', {
          stroke: middleColor,

          // Scale the speed, since this segment is different from the others in the coil.
          speedScale: ( loopRadius / CHARGE_SPACING ) / CHARGES_IN_RIGHT_END
        } );
        coilSegments.push( coilSegment );
      }
    }
    return coilSegments;
  }

  /**
   * Creates a set of charges to occupy coil segments.
   */
  private createChargedParticles( coilSegments: CoilSegment[] ): ChargedParticle[] {

    const chargedParticles: ChargedParticle[] = [];

    // coilSegments is ordered from left to right. So these are the indices for the ends of the coil.
    const leftEndIndex = 0;
    const rightEndIndex = coilSegments.length - 1;

    // Add charges for each curve segment.
    for ( let coilSegmentIndex = 0; coilSegmentIndex < coilSegments.length; coilSegmentIndex++ ) {

      // Compute how many charges to add for this curve segment. The number of charges is fixed for the ends
      // of the coil, and a function of loop radius for the other segments.
      let numberOfCharges;
      if ( coilSegmentIndex === leftEndIndex ) {
        numberOfCharges = CHARGES_IN_LEFT_END;
      }
      else if ( coilSegmentIndex === rightEndIndex ) {
        numberOfCharges = CHARGES_IN_RIGHT_END;
      }
      else {
        numberOfCharges = Math.floor( this.loopRadiusProperty.value / CHARGE_SPACING );
      }
      assert && assert( Number.isInteger( numberOfCharges ) && numberOfCharges > 0,
        `invalid numberOfCharges: ${numberOfCharges}` );

      // Add charges for this curve segment.
      for ( let i = 0; i < numberOfCharges; i++ ) {
        const chargedParticle = new ChargedParticle( {
          normalizedCurrentProperty: this.normalizedCurrentProperty,
          normalizedCurrentRange: this.normalizedCurrentRange,
          currentFlowProperty: this.currentFlowProperty,
          currentSpeedScaleProperty: this.currentSpeedScaleProperty,
          coilSegments: coilSegments,
          coilSegmentIndex: coilSegmentIndex,
          coilSegmentPosition: i / numberOfCharges
        } );
        chargedParticles.push( chargedParticle );
      }
    }

    return chargedParticles;
  }
}

faradaysElectromagneticLab.register( 'Coil', Coil );