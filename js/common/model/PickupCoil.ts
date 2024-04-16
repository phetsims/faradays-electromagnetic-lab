// Copyright 2023-2024, University of Colorado Boulder

/**
 * PickupCoil is the model of a pickup coil. Its behavior follows Faraday's Law for electromagnetic induction.
 *
 * This is based on PickupCoil.java in the Java version of this sim.
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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import LightBulb, { LightBulbOptions } from './LightBulb.js';
import Voltmeter, { VoltmeterOptions } from './Voltmeter.js';
import CurrentIndicator from './CurrentIndicator.js';
import PickupCoilSamplePointsStrategy from './PickupCoilSamplePointsStrategy.js';
import FELMovable, { FELMovableOptions } from './FELMovable.js';
import FELConstants from '../FELConstants.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import FELQueryParameters, { CurrentFlow } from '../FELQueryParameters.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ConstantDtClock from './ConstantDtClock.js';

type SelfOptions = {
  maxEMF: number; // the initial value of maxEMFProperty
  transitionSmoothingScale?: number; // the initial value of transitionSmoothingScaleProperty
  samplePointsStrategy: PickupCoilSamplePointsStrategy; // strategy used to populate B-field samplePoints
  coilOptions?: PickOptional<CoilOptions, 'maxLoopArea' | 'loopAreaPercentRange' | 'currentSpeedScale'>; // passed to Coil
  lightBulbOptions?: PickOptional<LightBulbOptions, 'lightsWhenCurrentChangesDirectionProperty'>; // passed to LightBulb
  voltmeterOptions?: PickOptional<VoltmeterOptions, 'kinematicsEnabledProperty'>; // passed to Voltmeter
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

  // Used exclusively in calibrateMaxEMF, does not need to be stateful for PhET-iO
  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/66 This can likely be deleted when calibration method is changed.
  private largestAbsoluteEMF; // in volts

  // Relative magnitude and direction of current in the coil. See Coil normalizedCurrentProperty.
  private readonly normalizedCurrentProperty: TReadOnlyProperty<number>;

  // Devices that respond to induced EMF, aka 'current indicators'
  public readonly lightBulb: LightBulb;
  public readonly voltmeter: Voltmeter;

  // Which current indicator is visible in the view
  public readonly currentIndicatorProperty: Property<CurrentIndicator>;

  // B-field sample points along the vertical axis of the coil
  public readonly samplePointsProperty: TReadOnlyProperty<Vector2[]>;

  // DEBUG: Writeable via developer controls only, when running with &dev query parameter. Dividing the coil's EMF by
  // this number will give us the coil's normalized current (see Coil.normalizedCurrentProperty), which determines the
  // responsiveness of view components. This number should be set as close as possible to the maximum EMF that can be
  // induced given the range of all model parameters. See calibrateMaxEMF for guidance on how to set this.
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

  public constructor( magnet: Magnet, currentFlowProperty: TReadOnlyProperty<CurrentFlow>, providedOptions: PickupCoilOptions ) {

    const options = optionize<PickupCoilOptions, StrictOmit<SelfOptions, 'coilOptions' | 'lightBulbOptions' | 'voltmeterOptions'>, FELMovableOptions>()( {

      // SelfOptions
      transitionSmoothingScale: 1 // no smoothing
    }, providedOptions );

    super( options );

    this.magnet = magnet;

    // We want some Properties to appear to be children of the coil element. We could also have done this by
    // subclassing Coil, but having something like PickupCoilCoil seemed confusing, and unnecessary.
    const coilTandem = options.tandem.createTandem( 'coil' );

    this._deltaFluxProperty = new NumberProperty( 0, {
      tandem: coilTandem.createTandem( 'deltaFluxProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioDocumentation: 'Relative change in flux in the coil.'
    } );
    this.deltaFluxProperty = this._deltaFluxProperty;

    this._emfProperty = new NumberProperty( 0, {
      tandem: coilTandem.createTandem( 'emfProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Relative EMF induced by the change in flux.'
    } );
    this.emfProperty = this._emfProperty;

    this.largestAbsoluteEMF = 0.0;

    // Check that maxEMFProperty is calibrated properly.
    if ( FELQueryParameters.calibrateEMF ) {
      this._emfProperty.lazyLink( () => this.calibrateMaxEMF() );
    }

    this.maxEMFProperty = new NumberProperty( options.maxEMF, {
      range: new Range( 10000, 5000000 )
      // Do not instrument. This is a PhET developer Property.
    } );

    // Normalized current is proportional to the induced EMF. We are considering resistance to be constant,
    // unaffected by the coil's loop area and number of loops.
    this.normalizedCurrentProperty = new DerivedProperty( [ this.emfProperty, this.maxEMFProperty ],
      ( emf, maxEMF ) => {
        const normalizedCurrent = emf / maxEMF;
        return FELConstants.NORMALIZED_CURRENT_RANGE.constrainValue( normalizedCurrent );
      }, {
        isValidValue: normalizedCurrent => FELConstants.NORMALIZED_CURRENT_RANGE.contains( normalizedCurrent ),
        tandem: coilTandem.createTandem( 'normalizedCurrentProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: FELConstants.NORMALIZED_CURRENT_PHET_IO_DOCUMENTATION
      } );

    this.coil = new Coil( this.normalizedCurrentProperty, FELConstants.NORMALIZED_CURRENT_RANGE, currentFlowProperty,
      combineOptions<CoilOptions>( {
        maxLoopArea: 70685, // to match Java version
        loopAreaPercentRange: new RangeWithValue( 20, 100, 50 ),
        numberOfLoopsRange: new RangeWithValue( 1, 4, 2 ),
        tandem: coilTandem
      }, options.coilOptions ) );

    this.lightBulb = new LightBulb( this.normalizedCurrentProperty, FELConstants.NORMALIZED_CURRENT_RANGE,
      combineOptions<LightBulbOptions>( {
        tandem: options.tandem.createTandem( 'lightBulb' )
      }, options.lightBulbOptions ) );

    this.voltmeter = new Voltmeter( this.normalizedCurrentProperty, FELConstants.NORMALIZED_CURRENT_RANGE,
      combineOptions<VoltmeterOptions>( {
        tandem: options.tandem.createTandem( 'voltmeter' )
      }, options.voltmeterOptions ) );

    this.currentIndicatorProperty = new Property<CurrentIndicator>( this.lightBulb, {
      validValues: [ this.lightBulb, this.voltmeter ],
      tandem: options.tandem.createTandem( 'currentIndicatorProperty' ),
      phetioValueType: CurrentIndicator.CurrentIndicatorIO,
      phetioFeatured: true
    } );

    this.samplePointsProperty = new DerivedProperty( [ this.coil.loopRadiusProperty ], loopRadius =>
      options.samplePointsStrategy.createSamplePoints( loopRadius ) );

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

    // Instantiate _fluxProperty last, so that its initial value is correct for the configuration of the coil.
    this._fluxProperty = new NumberProperty( this.getFlux(), {
      tandem: coilTandem.createTandem( 'fluxProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Relative flux in the coil.'
    } );
    this.fluxProperty = this._fluxProperty;
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
    this.coil.step( dt );
    if ( this.currentIndicatorProperty.value === this.voltmeter ) {
      this.voltmeter.step( dt );
    }
  }

  /**
   * Clears any EMF that may be present in the pickup coil. By calling updateEMF twice without changing anything else,
   * there will be no change in flux, and therefore no induced EMF. This was added as a workaround to ignore the EMF
   * induced by switching power supplies. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/92.
   */
  public clearEMF(): void {
    if ( this.emfProperty.value !== 0 ) {
      this.updateEMF( ConstantDtClock.DT );
      this.updateEMF( ConstantDtClock.DT );
    }
    assert && assert( this.emfProperty.value === 0, `unexpected emfProperty.value: ${this.emfProperty.value}` );
  }

  /**
   * Updates the induced EMF (and other related Properties) using Faraday's Law.
   */
  private updateEMF( dt: number ): void {
    assert && assert( dt === ConstantDtClock.DT, `invalid dt=${dt}` );

    // Flux in the coil.
    const flux = this.getFlux();

    // Change in flux.
    this._deltaFluxProperty.value = flux - this._fluxProperty.value;
    this._fluxProperty.value = flux;

    // Induced EMF.
    this._emfProperty.value = -( this._deltaFluxProperty.value / dt );
  }

  /**
   * Gets the flux in the pickup coil.
   */
  private getFlux(): number {

    // Get an average for Bx over the sample points.
    const averageBx = this.getAverageBx();

    // Flux in one loop.
    const A = this.getEffectiveLoopArea();
    const loopFlux = A * averageBx;

    // Flux in the coil.
    return this.coil.numberOfLoopsProperty.value * loopFlux;
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

    // Keeps track of the largest EMF seen by the pickup coil. This is useful for determining the desired value of
    // maxEMFProperty. Run the sim with &log query parameter, set model controls to their max values, then observe
    // the logging output in the browser console. The largest value that you see is the value that should be used
    // for maxEMFProperty.
    if ( absEMF > this.largestAbsoluteEMF ) {
      this.largestAbsoluteEMF = absEMF;
      console.log( `PickupCoil.calibrateMaxEMF, largestAbsoluteEMF=${this.largestAbsoluteEMF} for normalizedCurrent=${this.normalizedCurrentProperty.value}` );

      // If this prints, you have maxEMFProperty set too low. This will cause view components to exhibit responses
      // that are less than their maximums. For example, the voltmeter won't fully deflect, and the lightbulb won't
      // fully light.
      if ( this.largestAbsoluteEMF > this.maxEMFProperty.value ) {
        console.log( `PickupCoil.calibrateMaxEMF: Recalibrate ${this.maxEMFProperty.tandem.name} with ${this.largestAbsoluteEMF}` );

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

    const samplePoints = this.samplePointsProperty.value;
    const magnetStrength = this.magnet.strengthProperty.value;

    let sumBx = 0;
    for ( let i = 0; i < samplePoints.length; i++ ) {

      const x = this.positionProperty.value.x + samplePoints[ i ].x;
      const y = this.positionProperty.value.y + samplePoints[ i ].y;
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

    return sumBx / samplePoints.length;
  }

  //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/156 EMF does not behave as expected.
  /**
   * Ported directly from the Java versions, this is a workaround for Unfuddle ticket
   * https://phet.unfuddle.com/a#/projects/9404/tickets/by_number/721.
   *
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
    const width = this.coil.loopRadiusRange.min;
    const height = 2 * this.coil.loopRadiusProperty.value;
    return width * height;
  }
}

faradaysElectromagneticLab.register( 'PickupCoil', PickupCoil );