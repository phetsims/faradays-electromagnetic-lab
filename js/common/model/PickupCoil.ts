// Copyright 2023-2024, University of Colorado Boulder

/**
 * PickupCoil is the model of a pickup coil. Its behavior follows Faraday's Law for electromagnetic induction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Coil, { CoilOptions } from './Coil.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Magnet from './Magnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import LightBulb, { LightBulbOptions } from './LightBulb.js';
import Voltmeter from './Voltmeter.js';
import CurrentIndicator from './CurrentIndicator.js';
import PickupCoilSamplePointsStrategy from './PickupCoilSamplePointsStrategy.js';
import FELMovable, { FELMovableOptions } from './FELMovable.js';
import FELConstants from '../FELConstants.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import FELQueryParameters from '../FELQueryParameters.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ConstantStepEmitter from './ConstantStepEmitter.js';

const WIRE_WIDTH = 16;
const LOOP_SPACING = 1.5 * WIRE_WIDTH; // loosely-packed loops

type SelfOptions = {
  maxEMF: number; // the initial value of maxEMFProperty
  transitionSmoothingScale?: number; // the initial value of transitionSmoothingScaleProperty
  samplePointsStrategy: PickupCoilSamplePointsStrategy; // see PickupCoilSamplePointsStrategy.ts
  coilOptions?: PickOptional<CoilOptions, 'electronSpeedScale'>; // passed to Coil
  lightBulbOptions?: PickOptional<LightBulbOptions, 'lightsWhenCurrentChangesDirection'>; // passed to LightBulb
};

export type PickupCoilOptions = SelfOptions & FELMovableOptions;

export default class PickupCoil extends FELMovable {

  // The magnet whose field this coil is in
  private readonly magnet: Magnet;

  // The coil that induces the EMF
  public readonly coil: Coil;

  // Flux in the coil
  private readonly _fluxProperty: Property<number>;
  public readonly fluxProperty: TReadOnlyProperty<number>;

  // Change in flux in the coil
  private readonly _deltaFluxProperty: Property<number>;
  public readonly deltaFluxProperty: TReadOnlyProperty<number>;

  // EMF induced by the change in flux
  private readonly _emfProperty: Property<number>;
  public readonly emfProperty: TReadOnlyProperty<number>;

  // Amplitude and direction of current in the coil. See Coil currentAmplitudeProperty.
  private readonly currentAmplitudeProperty: TReadOnlyProperty<number>;

  // Devices that respond to induced EMF, aka 'current indicators'
  public readonly lightBulb: LightBulb;
  public readonly voltmeter: Voltmeter;

  // Which current indicator is visible in the view
  public readonly currentIndicatorProperty: Property<CurrentIndicator>;

  // B-field sample points along the vertical axis of the coil
  public samplePoints: ObservableArray<Vector2>;

  // Strategy used to populate samplePoints
  private readonly samplePointsStrategy: PickupCoilSamplePointsStrategy;

  // Used exclusively in calibrateMaxEMF, does not need to be stateful for PhET-iO
  private _biggestAbsEmf; // in volts

  // DEBUG: Displayed in PickupCoilDebuggerPanel, when running with &dev query parameter.
  // Average of the B-field samples perpendicular (Bx) to the coil's vertical axis.
  private readonly _averageBxProperty: Property<number>;
  public readonly averageBxProperty: TReadOnlyProperty<number>;

  // DEBUG: Writeable via developer controls only, when running with &dev query parameter.
  // Dividing the coil's EMF by this number will give us the coil's current amplitude, a number between 0 and 1 that
  // determines the responsiveness of view components. This number should be set as close as possible to the maximum
  // EMF that can be induced given the range of all model parameters. See calibrateMaxEMF for guidance on how
  // to set this.
  public readonly maxEMFProperty: NumberProperty;

  // DEBUG: Writeable via developer controls only, when running with &dev query parameter.
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

  // DEBUG: Writeable via developer controls only, when running with &dev query parameter.
  // Makes the sample points visible in the view.
  public readonly samplePointsVisibleProperty: Property<boolean>;

  // DEBUG: Writeable via developer controls only, when running with &dev query parameter.
  // Makes a debugging panel visible in the view, which shows important values related to the pickup coil.
  public readonly debuggerPanelVisibleProperty: Property<boolean>;

  // Reusable sample point
  private readonly reusableSamplePoint: Vector2;

  // Reusable B-field vector
  private readonly reusableFieldVector: Vector2;

  public constructor( magnet: Magnet, providedOptions: PickupCoilOptions ) {

    const options = optionize<PickupCoilOptions, StrictOmit<SelfOptions, 'coilOptions' | 'lightBulbOptions'>, FELMovableOptions>()( {

      // SelfOptions
      transitionSmoothingScale: 1 // no smoothing
    }, providedOptions );

    super( options );

    this.magnet = magnet;

    this._fluxProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'fluxProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Relative flux in the coil.'
    } );
    this.fluxProperty = this._fluxProperty;

    this._deltaFluxProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'deltaFluxProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioDocumentation: 'Relative change in flux in the coil'
    } );
    this.deltaFluxProperty = this._deltaFluxProperty;

    this._emfProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'emfProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioDocumentation: 'Relative EMF induced by the change in flux'
    } );
    this.emfProperty = this._emfProperty;

    // Check that maxEMFProperty is calibrated properly.
    if ( FELQueryParameters.calibrateEMF ) {
      this._emfProperty.lazyLink( () => this.calibrateMaxEMF() );
    }

    this.maxEMFProperty = new NumberProperty( options.maxEMF, {
      range: new Range( 10000, 5000000 )
      // Do not instrument. This is a PhET developer Property.
    } );

    this.currentAmplitudeProperty = new DerivedProperty( [ this.emfProperty, this.maxEMFProperty ],
      ( emf, maxEMF ) => {
        const currentAmplitude = emf / maxEMF;
        return FELConstants.CURRENT_AMPLITUDE_RANGE.constrainValue( currentAmplitude );
      }, {
        isValidValue: currentAmplitude => FELConstants.CURRENT_AMPLITUDE_RANGE.contains( currentAmplitude ),
        tandem: options.tandem.createTandem( 'currentAmplitudeProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true,
        phetioDocumentation: 'For internal use only.'
      } );

    this.coil = new Coil( this.currentAmplitudeProperty, FELConstants.CURRENT_AMPLITUDE_RANGE,
      combineOptions<CoilOptions>( {
        maxLoopArea: 35345, // in the Java version, max radius was 75, so max area was Math.PI * 75 * 75 = 35342.917352885175
        loopAreaPercentRange: new RangeWithValue( 20, 100, 50 ),
        numberOfLoopsRange: new RangeWithValue( 1, 4, 2 ),
        wireWidth: WIRE_WIDTH,
        loopSpacing: LOOP_SPACING,
        tandem: options.tandem.createTandem( 'coil' )
      }, options.coilOptions ) );

    this.lightBulb = new LightBulb( this.currentAmplitudeProperty, FELConstants.CURRENT_AMPLITUDE_RANGE,
      combineOptions<LightBulbOptions>( {
        tandem: options.tandem.createTandem( 'lightBulb' )
      }, options.lightBulbOptions ) );

    this.voltmeter = new Voltmeter( this.currentAmplitudeProperty, FELConstants.CURRENT_AMPLITUDE_RANGE,
      options.tandem.createTandem( 'voltmeter' ) );

    this.currentIndicatorProperty = new Property<CurrentIndicator>( this.lightBulb, {
      validValues: [ this.lightBulb, this.voltmeter ],
      tandem: options.tandem.createTandem( 'currentIndicatorProperty' ),
      phetioValueType: CurrentIndicator.CurrentIndicatorIO,
      phetioFeatured: true
    } );

    this.samplePoints = createObservableArray( {
      tandem: options.tandem.createTandem( 'samplePoints' ),
      phetioReadOnly: true,
      phetioType: createObservableArray.ObservableArrayIO( Vector2.Vector2IO ),
      phetioDocumentation: 'B-field sample points along the vertical axis of the coil'
    } );

    this.samplePointsStrategy = options.samplePointsStrategy;

    this._biggestAbsEmf = 0.0;

    this._averageBxProperty = new NumberProperty( 0
      // Do not instrument. This is a PhET developer Property.
    );
    this.averageBxProperty = this._averageBxProperty;

    this.transitionSmoothingScaleProperty = new NumberProperty( options.transitionSmoothingScale, {
      range: new Range( 0.1, 1 )
      // Do not instrument. This is a PhET developer Property.
    } );

    this.samplePointsVisibleProperty = new BooleanProperty( false
      // Do not instrument. This is a PhET developer Property.
    );

    this.debuggerPanelVisibleProperty = new BooleanProperty( false
      // Do not instrument. This is a PhET developer Property.
    );

    this.reusableSamplePoint = new Vector2( 0, 0 );
    this.reusableFieldVector = new Vector2( 0, 0 );

    this.coil.loopAreaProperty.link( () => this.updateSamplePoints() );
  }

  public override reset(): void {
    super.reset();
    this.coil.reset();
    this._fluxProperty.reset();
    this._deltaFluxProperty.reset();
    this._emfProperty.reset();
    this.lightBulb.reset();
    this.voltmeter.reset();
    this.currentIndicatorProperty.reset();
    // Do not reset Properties documented as 'DEBUG' above.
  }

  public step( dt: number ): void {
    this.updateEMF( dt );
    if ( this.currentIndicatorProperty.value === this.voltmeter ) {
      this.voltmeter.step( dt );
    }
  }

  /**
   * Updates the sample points for the coil.
   * The samples points are used to measure the B-field in the calculation of EMF.
   */
  private updateSamplePoints(): void {
    this.samplePoints.clear();
    this.samplePoints.push( ...this.samplePointsStrategy.createSamplePoints( this.coil.getLoopRadius() ) );
  }

  /**
   * Updates the induced EMF (and other related Properties) using Faraday's Law.
   */
  private updateEMF( dt: number ): void {
    assert && assert( dt === ConstantStepEmitter.CONSTANT_DT, `invalid dt=${dt}, ConstantStepEmitter` );

    // Get an average for Bx over the sample points.
    this._averageBxProperty.value = this.getAverageBx();

    // Flux in one loop.
    const A = this.getEffectiveLoopArea();
    const loopFlux = A * this._averageBxProperty.value;

    // Flux in the coil.
    const flux = this.coil.numberOfLoopsProperty.value * loopFlux;

    // Change in flux.
    this._deltaFluxProperty.value = flux - this._fluxProperty.value;
    this._fluxProperty.value = flux;

    // Induced EMF.
    this._emfProperty.value = -( this._deltaFluxProperty.value / dt );
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
      console.log( `PickupCoil.calibrateMaxEMF, biggestEmf=${this._biggestAbsEmf} for currentAmplitude=${this.currentAmplitudeProperty.value}` );

      // If this prints, you have maxEMFProperty set too low. This will cause view components to exhibit responses
      // that are less than their maximums. For example, the voltmeter won't fully deflect, and the lightbulb won't
      // fully light.
      if ( this._biggestAbsEmf > this.maxEMFProperty.value ) {
        console.log( `PickupCoil.calibrateMaxEMF: Recalibrate ${this.maxEMFProperty.tandem.name} with ${this._biggestAbsEmf}` );

        // From the Java version: The coil could theoretically be self-calibrating. If we notice that we've exceeded
        // maxEMFProperty, then adjust its value. This would be OK only if we started with a value that was in
        // the ballpark, because we don't want the user to perceive a noticeable change in the sim's behavior.
      }
    }
  }

  /**
   * Gets the average of Bx over the coil's sample points.
   */
  private getAverageBx(): number {

    const magnetStrength = this.magnet.strengthProperty.value;

    let sumBx = 0;
    for ( let i = 0; i < this.samplePoints.length; i++ ) {

      const x = this.positionProperty.value.x + this.samplePoints[ i ].x;
      const y = this.positionProperty.value.y + this.samplePoints[ i ].y;
      this.reusableSamplePoint.setXY( x, y );

      // Find the B-field vector at that point.
      const fieldVector = this.magnet.getFieldVector( this.reusableSamplePoint, this.reusableFieldVector );

      // If Bx is equal to the magnet strength, then our B-field sample was inside the magnet.
      // Use a fudge factor to scale the sample so that the transitions between inside and outside the magnet are
      // not abrupt. See Unfuddle ticket https://phet.unfuddle.com/a#/projects/9404/tickets/by_number/248.
      let Bx = fieldVector.x;
      if ( Math.abs( Bx ) === magnetStrength ) {
        Bx *= this.transitionSmoothingScaleProperty.value;
      }

      // Accumulate a sum of Bx values.
      sumBx += Bx;
    }

    return sumBx / this.samplePoints.length;
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
    const width = this.coil.getMinLoopRadius();
    const height = 2 * this.coil.getLoopRadius();
    return width * height;
  }
}

faradaysElectromagneticLab.register( 'PickupCoil', PickupCoil );