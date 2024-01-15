// Copyright 2023-2024, University of Colorado Boulder

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
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import LightBulb from './LightBulb.js';
import Voltmeter from './Voltmeter.js';
import CurrentIndicator from './CurrentIndicator.js';
import FELModel from './FELModel.js';
import MappedProperty from '../../../../axon/js/MappedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import PickupCoilSamplePointsStrategy from './PickupCoilSamplePointsStrategy.js';

const WIRE_WIDTH = 16;
const LOOP_SPACING = 1.5 * WIRE_WIDTH; // loosely-packed loops

type SelfOptions = {
  maxEMF: number; // the initial value of maxEMFProperty
  transitionSmoothingScale?: number; // the initial value of transitionSmoothingScaleProperty
  samplePointsStrategy: PickupCoilSamplePointsStrategy; // see PickupCoilSamplePointsStrategy.ts
};

export type PickupCoilOptions = SelfOptions &
  StrictOmit<CoilOptions, 'numberOfLoopsRange' | 'loopAreaRange' | 'wireWidth' | 'loopSpacing'>;

export default class PickupCoil extends Coil {

  private readonly magnet: Magnet;
  public readonly lightBulb: LightBulb;
  public readonly voltmeter: Voltmeter;

  // Strategy used to create sample points
  private readonly samplePointsStrategy: PickupCoilSamplePointsStrategy;

  // Writeable version of this.currentAmplitudeProperty: TReadOnlyProperty<number>
  private readonly _currentAmplitudeProperty: NumberProperty;

  // Loop area as a percentage, which is how the UI sets and views it.
  public readonly loopAreaPercentProperty: PhetioProperty<number>;
  public readonly loopAreaPercentRange: Range;

  //TODO document
  private readonly _fluxProperty: Property<number>;
  public readonly fluxProperty: TReadOnlyProperty<number>;

  //TODO document
  private readonly _emfProperty: Property<number>;
  public readonly emfProperty: TReadOnlyProperty<number>;

  //TODO document
  private readonly _averageBxProperty: Property<number>;
  public readonly averageBxProperty: TReadOnlyProperty<number>;

  //TODO document
  private readonly _deltaFluxProperty: Property<number>;
  public readonly deltaFluxProperty: TReadOnlyProperty<number>;

  // Used exclusively in calibrateMaxEMF, does not need to be stateful for PhET-iO
  private _biggestAbsEmf; // in volts

  // B-field sample points along the vertical axis of the coil
  public samplePoints: ObservableArray<Vector2>;

  // Which EMF indicator is visible in the view
  public readonly currentIndicatorProperty: Property<CurrentIndicator>;

  // *** Writeable via developer controls only, when running with &dev query parameter. ***
  // Dividing the coil's EMF by this number will give us the coil's current amplitude, a number between 0 and 1 that
  // determines the responsiveness of view components. This number should be set as close as possible to the maximum
  // EMF that can be induced given the range of all model parameters. See calibrateMaxEMF for guidance on how
  // to set this.
  public readonly maxEMFProperty: NumberProperty;

  // *** Writeable via developer controls only, when running with &dev query parameter. ***
  // This is a scaling factor used to smooth out abrupt changes that occur when the magnet transitions between being
  // inside & outside the coil. This is used to scale the B-field for sample points inside the magnet, eliminating
  // abrupt transitions at the left and right edges of the magnet. For any sample point inside the magnet, the B-field
  // sample is multiplied by this value.
  //
  // To set this value, follow these steps:
  // * Run with &dev query parameter to see developer accordion boxes. For screens that have a pickup coil:
  // * Check the "Debugger Panel" checkbox to see the "Pickup Coil debugger" panel, which displays flux and other values.
  // * Move the magnet horizontally through the coil until, by moving it one pixel, you see an abrupt change in the
  //   displayed flux value.
  // * Note the 2 flux values when the abrupt change occurs.
  // * Move the magnet so that the largest of the 2 flux values is displayed.
  // * Adjust the "Transition Smoothing Scale" developer control until the larger value is reduced to approximately
  //   the same value as the smaller value.
  public readonly transitionSmoothingScaleProperty: NumberProperty;

  // *** Writeable via developer controls only, when running with &dev query parameter. ***
  // Makes the sample points visible in the view.
  public readonly samplePointsVisibleProperty: Property<boolean>;

  // *** Writeable via developer controls only, when running with &dev query parameter. ***
  // Makes a debugging panel visible in the view, which shows important values related to the pickup coil.
  public readonly debuggerPanelVisibleProperty: Property<boolean>;

  // Reusable sample point
  private readonly reusableSamplePoint: Vector2;

  // Reusable B-field vector
  private readonly reusableFieldVector: Vector2;

  public constructor( magnet: Magnet, providedOptions: PickupCoilOptions ) {

    const options = optionize<PickupCoilOptions, SelfOptions, CoilOptions>()( {

      // SelfOptions
      transitionSmoothingScale: 1, // no smoothing

      // CoilOptions

      // In the Java version, loopAreaRange was computed from loop radius range [68, 150, 75], resulting in
      // [14526.724430199205, 70685.83470577035, 35342.917352885175]. To avoid problems, we have rounded the max
      // to an integer that results in the min (20%) and default (50%) both being integers. This should be close
      // enough to the Java version to avoid having to recalibrate the model.
      // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/48
      loopAreaRange: new RangeWithValue( 14138, 70690, 35345 ),
      numberOfLoopsRange: new RangeWithValue( 1, 4, 2 ),
      wireWidth: WIRE_WIDTH,
      loopSpacing: LOOP_SPACING
    }, providedOptions );

    const currentAmplitudeProperty = new NumberProperty( 0, {
      range: new Range( -1, 1 ),
      tandem: options.tandem.createTandem( 'currentAmplitudeProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );

    super( currentAmplitudeProperty, options );

    this.magnet = magnet;

    this.samplePointsStrategy = options.samplePointsStrategy;

    this.lightBulb = new LightBulb( this, {
      lightsWhenCurrentChangesDirection: true,
      tandem: options.tandem.createTandem( 'lightBulb' )
    } );

    this.voltmeter = new Voltmeter( this, options.tandem.createTandem( 'voltmeter' ) );

    this._currentAmplitudeProperty = currentAmplitudeProperty;

    this.loopAreaPercentRange = new Range( 100 * this.loopAreaProperty.range.min / this.loopAreaProperty.range.max, 100 );

    this.loopAreaPercentProperty = new MappedProperty<number, number>( this.loopAreaProperty, {
      bidirectional: true,
      map: ( loopArea: number ) => 100 * loopArea / this.loopAreaProperty.range.max,
      inverseMap: ( percent: number ) => percent * this.loopAreaProperty.range.max / 100,
      isValidValue: percent => this.loopAreaPercentRange.contains( percent ),
      tandem: options.tandem.createTandem( 'loopAreaPercentProperty' ),
      phetioValueType: NumberIO,
      phetioReadOnly: true, // use loopAreaProperty
      phetioDocumentation: 'Loop area as a percentage, which is how the UI sets and views it. ' +
                           'If you want to change this, use the sim or see loopAreaProperty.'
    } );

    this._fluxProperty = new NumberProperty( 0, {
      units: 'Wb',
      tandem: options.tandem.createTandem( 'fluxProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
      //TODO phetioDocumentation
    } );
    this.fluxProperty = this._fluxProperty;

    this._emfProperty = new NumberProperty( 0, {
      units: 'V',
      tandem: options.tandem.createTandem( 'emfProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
      //TODO phetioDocumentation
    } );
    this.emfProperty = this._emfProperty;

    this._averageBxProperty = new NumberProperty( 0, {
      units: 'V',
      tandem: options.tandem.createTandem( 'averageBxProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
    this.averageBxProperty = this._averageBxProperty;

    this._deltaFluxProperty = new NumberProperty( 0, {
      units: 'V',
      tandem: options.tandem.createTandem( 'deltaFluxProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
    this.deltaFluxProperty = this._deltaFluxProperty;

    this._biggestAbsEmf = 0.0;

    this.samplePoints = createObservableArray( {
      tandem: options.tandem.createTandem( 'samplePoints' ),
      phetioReadOnly: true,
      phetioType: createObservableArray.ObservableArrayIO( Vector2.Vector2IO ),
      phetioDocumentation: 'B-field sample points along the vertical axis of the coil'
    } );

    this.currentIndicatorProperty = new Property<CurrentIndicator>( this.lightBulb, {
      validValues: [ this.lightBulb, this.voltmeter ],
      tandem: options.tandem.createTandem( 'currentIndicatorProperty' ),
      phetioValueType: CurrentIndicator.CurrentIndicatorIO,
      phetioFeatured: true
      //TODO phetioDocumentation
    } );

    this.maxEMFProperty = new NumberProperty( options.maxEMF, {
      range: new Range( 10000, 5000000 )
      // Do not instrument. This is a PhET developer Property.
    } );

    this.transitionSmoothingScaleProperty = new NumberProperty( options.transitionSmoothingScale, {
      range: new Range( 0.1, 1 )
      // Do not instrument. This is a PhET developer Property.
    } );

    this.samplePointsVisibleProperty = new BooleanProperty( false, {
      // Do not instrument. This is a PhET developer Property.
    } );

    this.debuggerPanelVisibleProperty = new BooleanProperty( false, {
      // Do not instrument. This is a PhET developer Property.
    } );

    this.reusableSamplePoint = new Vector2( 0, 0 );
    this.reusableFieldVector = new Vector2( 0, 0 );

    this.loopAreaProperty.link( () => this.updateSamplePoints() );
  }

  public override reset(): void {
    super.reset();
    this.lightBulb.reset();
    this.voltmeter.reset();
    this._currentAmplitudeProperty.reset();
    this._fluxProperty.reset();
    this._emfProperty.reset();
    this._averageBxProperty.reset();
    this._deltaFluxProperty.reset();
    this.currentIndicatorProperty.reset();
    this.electronsVisibleProperty.reset();
    //TODO
    // Do not reset developer Properties.
  }

  public step( dt: number ): void {
    assert && assert( dt === FELModel.CONSTANT_DT, `invalid dt=${dt}, see FELModel step` );
    this.updateEMF( dt );
    if ( this.currentIndicatorProperty.value === this.voltmeter ) {
      this.voltmeter.step( dt );
    }
  }

  public getMinLoopRadius(): number {
    return Math.sqrt( this.loopAreaProperty.rangeProperty.value.min / Math.PI );
  }

  /**
   * Updates the sample points for the coil.
   * The samples points are used to measure the B-field in the calculation of EMF.
   */
  private updateSamplePoints(): void {
    this.samplePoints.clear();
    this.samplePoints.push( ...this.samplePointsStrategy.createSamplePoints( this.getLoopRadius() ) );
  }

  /**
   * Updates the induced EMF (and other related instance data), using Faraday's Law.
   */
  private updateEMF( dt: number ): void {

    // Sum the B-field sample points.
    const sumBx = this.getSumBx();

    // Average the B-field sample points.
    this._averageBxProperty.value = sumBx / this.samplePoints.length;

    // Flux in one loop.
    const A = this.getEffectiveLoopArea();
    const loopFlux = A * this._averageBxProperty.value;

    // Flux in the coil.
    const flux = this.numberOfLoopsProperty.value * loopFlux;

    // Change in flux.
    this._deltaFluxProperty.value = flux - this._fluxProperty.value;
    this._fluxProperty.value = flux;

    // Induced EMF.
    const emf = -( this._deltaFluxProperty.value / dt );

    // If the EMF has changed, set the current in the coil.
    if ( emf !== this._emfProperty.value ) {
      this._emfProperty.value = emf;

      // Current amplitude is proportional to EMF amplitude.
      const currentAmplitude = emf / this.maxEMFProperty.value;
      this._currentAmplitudeProperty.value = Utils.clamp( currentAmplitude, -1, 1 );
    }

    // Check that maxEMFProperty is calibrated properly.
    phet.log && this.calibrateMaxEMF();
  }

  /**
   * Provides assistance for calibrating this coil. The easiest way to calibrate is to run the sim with the
   * &log query parameter, then follow these steps for each screen that has a PickupCoil model element.
   *
   * 1. Set the "Max EMF" developer control to its smallest value.
   * 2. Set the model parameters to their maximums, so that maximum EMF will be generated.
   * 3. Do whatever is required to generate EMF (move magnet through coil, run generator, etc.)
   * 4. Watch the console for a message that tells you what value to use.
   * 5. Change the value of maxEMF that is used to instantiate the PickupCoil.
   */
  private calibrateMaxEMF(): void {

    const absEMF = Math.abs( this._emfProperty.value );

    // Keeps track of the biggest EMF seen by the pickup coil. This is useful for determining the desired value of
    // maxEMFProperty. Run the sim with &log query parameter, set model controls to their max values, then observe
    // the logging output in the browser console. The largest value that you see is the value that should be used
    // for maxEMFProperty.
    if ( absEMF > this._biggestAbsEmf ) {
      this._biggestAbsEmf = absEMF;
      phet.log && phet.log( `PickupCoil.calibrateMaxEMF, biggestEmf=${this._biggestAbsEmf}` );

      // If this prints, you have maxEMFProperty set too low. This will cause view components to exhibit responses
      // that are less than their maximums. For example, the voltmeter won't fully deflect, and the lightbulb won't
      // fully light.
      if ( this._biggestAbsEmf > this.maxEMFProperty.value ) {
        phet.log && phet.log( `PickupCoil.calibrateMaxEMF: Recalibrate ${this.maxEMFProperty.tandem.name} with ${this._biggestAbsEmf}` );

        // From the Java version: The coil could theoretically be self-calibrating. If we notice that we've exceeded
        // maxEMFProperty, then adjust its value. This would be OK only if we started with a value that was in
        // the ballpark, because we don't want the user to perceive a noticeable change in the sim's behavior.
      }
    }
  }

  /**
   * Gets the sum of Bx at the coil's sample points.
   */
  private getSumBx(): number {

    const magnetStrength = this.magnet.strengthProperty.value;

    // Sum the B-field sample points.
    let sumBx = 0;
    for ( let i = 0; i < this.samplePoints.length; i++ ) {

      const x = this.positionProperty.value.x + this.samplePoints[ i ].x;
      const y = this.positionProperty.value.y + this.samplePoints[ i ].y;
      this.reusableSamplePoint.setXY( x, y );

      // Find the B-field vector at that point.
      const fieldVector = this.magnet.getFieldVector( this.reusableSamplePoint, this.reusableFieldVector );

      // If the B-field x component is equal to the magnet strength, then our B-field sample was inside the magnet.
      // Use a fudge factor to scale the sample so that the transitions between inside and outside the magnet are
      // not abrupt. See Unfuddle ticket https://phet.unfuddle.com/a#/projects/9404/tickets/by_number/248.
      let Bx = fieldVector.x;
      if ( Math.abs( Bx ) === magnetStrength ) {
        Bx *= this.transitionSmoothingScaleProperty.value;
      }

      // Accumulate a sum of the sample points.
      sumBx += Bx;
    }

    return sumBx;
  }

  /**
   * Ported directly from the Java versions, this is a workaround for Unfuddle ticket
   * https://phet.unfuddle.com/a#/projects/9404/tickets/by_number/721.
   * When the magnet is in the center of the coil, increasing the loop size should decrease the EMF.  But since we are
   * averaging sample points on a vertical line, multiplying by the actual area would (incorrectly) result in an EMF
   * increase. The best solution would be to take sample points across the entire coil, but that requires many changes,
   * so Mike Dubson came up with this workaround. By fudging the area using a thin vertical rectangle, the results are
   * qualitatively (but not quantitatively) correct.
   *
   * NOTE from the Java version:
   * This fix required recalibration of all the scaling factors accessible via developer controls.
   */
  private getEffectiveLoopArea(): number {
    const width = this.getMinLoopRadius();
    const height = 2 * this.getLoopRadius();
    return width * height;
  }
}

faradaysElectromagneticLab.register( 'PickupCoil', PickupCoil );