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
import FELMovable, { FELMovableOptions } from './FELMovable.js';
import FELConstants from '../FELConstants.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import FELQueryParameters, { CurrentFlow } from '../FELQueryParameters.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ConstantDtClock from './ConstantDtClock.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';

type SelfOptions = {
  maxEMF: number; // the initial value of maxEMFProperty
  transitionSmoothingScale: number; // the initial value of transitionSmoothingScaleProperty
  samplePointsSpacing: number; // spacing between B-field sample points
  coilOptions?: PickOptional<CoilOptions, 'maxLoopArea' | 'loopAreaPercentRange' | 'currentSpeedScale'>; // passed to Coil
  lightBulbOptions?: PickOptional<LightBulbOptions, 'lightsWhenCurrentChangesDirectionProperty'>; // passed to LightBulb
  voltmeterOptions?: PickOptional<VoltmeterOptions, 'kinematicsEnabledProperty'>; // passed to Voltmeter
};

export type PickupCoilOptions = SelfOptions & FELMovableOptions;

export default class PickupCoil extends FELMovable {

  // The magnet whose field this coil is in
  public readonly magnet: Magnet;

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
  private largestAbsoluteEMF; // in volts

  // Relative magnitude and direction of current in the coil. See Coil normalizedCurrentProperty.
  private readonly normalizedCurrentProperty: TReadOnlyProperty<number>;

  // Devices that respond to induced EMF, aka 'current indicators'
  public readonly lightBulb: LightBulb;
  public readonly voltmeter: Voltmeter;

  // Which current indicator is visible in the view
  public readonly currentIndicatorProperty: Property<CurrentIndicator>;

  // B-field sample points along the vertical axis of the coil, in the coil's coordinate frame.
  public readonly samplePointsProperty: TReadOnlyProperty<Vector2[]>;
  private readonly samplePointSpacing: number;

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

  // Reusable instances, to optimize memory allocation.
  private readonly reusablePosition: Vector2;
  private readonly reusableFieldVector: Vector2;
  private readonly reusableDimension: Dimension2;

  public constructor( magnet: Magnet, currentFlowProperty: TReadOnlyProperty<CurrentFlow>, providedOptions: PickupCoilOptions ) {

    const options = optionize<PickupCoilOptions, StrictOmit<SelfOptions, 'coilOptions' | 'lightBulbOptions' | 'voltmeterOptions'>, FELMovableOptions>()(
      {}, providedOptions );

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

    this.largestAbsoluteEMF = 0;

    // Check that maxEMFProperty is calibrated properly.
    if ( FELQueryParameters.calibrateMaxEMF ) {
      this._emfProperty.lazyLink( () => this.calibrateMaxEMF() );
    }

    this.maxEMFProperty = new NumberProperty( options.maxEMF, {
      //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/156 This range makes Developer control unusable.
      range: new Range( 1E5, 1E7 )
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

    this.samplePointsProperty = new DerivedProperty( [ this.coil.loopRadiusProperty ],
      loopRadius => createSamplePoints( loopRadius, options.samplePointsSpacing ) );
    this.samplePointSpacing = options.samplePointsSpacing;

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

    this.reusablePosition = new Vector2( 0, 0 );
    this.reusableFieldVector = new Vector2( 0, 0 );
    this.reusableDimension = new Dimension2( 0, 0 );

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

    // Flux through the coil.
    const flux = this.getFlux();

    // Change in flux.
    this._deltaFluxProperty.value = flux - this._fluxProperty.value;
    this._fluxProperty.value = flux;

    // Induced EMF.
    this._emfProperty.value = -( this._deltaFluxProperty.value / dt );
  }

  /**
   * Gets the total flux for the coil.
   */
  private getFlux(): number {
    return this.coil.numberOfLoopsProperty.value * this.getLoopFlux();
  }

  /**
   * Gets the flux for one loop of the coil.
   */
  private getLoopFlux(): number {

    let loopFlux = 0;

    this.samplePointsProperty.value.forEach( samplePoint => {

      // Get Bx at the sample point.
      const Bx = this.getBx( samplePoint );

      // Get the portion of the loop's area that is associated with the sample point.
      const A = this.getSamplePointArea( samplePoint );

      // Add the contribution of this sample point to the loop's flux.
      loopFlux += Bx * A;
    } );

    return loopFlux;
  }

  /**
   * Gets Bx (the x component of the B-field vector) at a specified sample point.
   * @param samplePoint - in the coil's coordinate frame
   */
  private getBx( samplePoint: Vector2 ): number {

    // Position of samplePoint in global coordinates.
    const x = this.positionProperty.value.x + samplePoint.x;
    const y = this.positionProperty.value.y + samplePoint.y;
    this.reusablePosition.setXY( x, y );

    // Find the B-field vector at that point.
    const fieldVector = this.magnet.getFieldVector( this.reusablePosition, this.reusableFieldVector );

    // If Bx is equal to the magnet strength, then our B-field sample was inside the magnet.
    // Use a fudge factor to scale the sample so that the transitions between inside and outside the magnet are
    // not abrupt. See Unfuddle ticket https://phet.unfuddle.com/a#/projects/9404/tickets/by_number/248.
    let Bx = fieldVector.x;
    if ( Math.abs( Bx ) === this.magnet.strengthProperty.value ) {
      Bx *= this.transitionSmoothingScaleProperty.value;
    }

    return Bx;
  }

  /**
   * Gets the portion of the coil's area associated with a specific sample point.
   * @param samplePoint - in the coil's coordinate frame
   */
  private getSamplePointArea( samplePoint: Vector2 ): number {
    const size = this.getSamplePointAreaDimensions( samplePoint, this.reusableDimension );
    return size.width * size.height;
  }

  /**
   * Gets the dimensions of the portion of the coil's area associated with a specific sample point.
   * This is public because it is used by PickupCoilAreaNode to visualize the area for debugging purposes.
   *
   * @param samplePoint - in the coil's coordinate frame
   * @param reusableDimension
   */
  public getSamplePointAreaDimensions( samplePoint: Vector2, reusableDimension: Dimension2 ): Dimension2 {

    // Position of samplePoint in global coordinates.
    const x = this.positionProperty.value.x + samplePoint.x;
    const y = this.positionProperty.value.y + samplePoint.y;
    this.reusablePosition.setXY( x, y );

    // Use the algorithm for distance from the center of a circle to a chord to compute the length of the chord
    // that is perpendicular to the vertical line and goes through the sample point. If you're unfamiliar with
    // this algorithm, then see for example https://youtu.be/81jh931BkL0?si=2JR-xWRUwjeuagmf.
    const R = this.coil.loopRadiusProperty.value;
    const d = samplePoint.y; // distance from center of the circle (loop) to the chord
    let chordLength = 2 * Math.sqrt( Math.abs( R * R - d * d ) );

    // If the sample point is inside the magnet, using the chord length computed above would exaggerate the
    // sample point's contribution to flux. So use the magnet's thickness (depth). The field outside the magnet
    // is relatively weak, so ignore its contribution.
    const magnetThickness = this.magnet.size.depth;
    if ( magnetThickness < chordLength && this.magnet.isInside( this.reusablePosition ) ) {
      chordLength = magnetThickness;
    }
    assert && assert( chordLength !== 0 );

    // Area associated with the sample point.
    reusableDimension.width = chordLength;
    reusableDimension.height = this.samplePointSpacing;
    return reusableDimension;
  }

  /**
   * Provides assistance for calibrating the pickup coil. Run the sim with the &calibrateMaxEMF query parameter,
   * then follow these steps for each screen that has a PickupCoil model element.
   *
   * 1. Set the "Max EMF" developer control to its smallest value.
   * 2. Set magnet strength, number of loops, and loop area to their maximums, so that maximum EMF will be generated.
   * 3. Do whatever is required to generate EMF (move magnet through coil, run generator, etc.)
   * 4. Watch the console for a message that tells you what value to use.
   * 5. Change the value of PickupCoilOptions.maxEMF that is used to instantiate the PickupCoil.
   */
  private calibrateMaxEMF(): void {
    const absEMF = Math.abs( this._emfProperty.value );
    if ( absEMF > this.largestAbsoluteEMF ) {
      this.largestAbsoluteEMF = absEMF;
      // console.log( `PickupCoil.calibrateMaxEMF, largestAbsoluteEMF=${this.largestAbsoluteEMF} for normalizedCurrent=${this.normalizedCurrentProperty.value}` );

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
}

/**
 * Creates points for sampling the B-field, in the coil's coordinate frame. Points are distributed along a vertical
 * line that goes through the center of the pickup coil. One point is at the center of the coil. Points will be on
 * the edge of the coil only if the coil's radius is an integer multiple of the spacing.
 *
 * Note that the Java version had 2 sample-point strategies: see ConstantNumberOfSamplePointsStrategy and
 * VariableNumberOfSamplePointsStrategy in PickupCoil.java, both of which were ported to PickupCoilSamplePointsStrategy.ts.
 * ConstantNumberOfSamplePointsStrategy was used only for the Generator screen, and was determined to be unnecessary.
 * So this function is the simplified implementation of VariableNumberOfSamplePointsStrategy.
 */
function createSamplePoints( loopRadius: number, spacing: number ): Vector2[] {

  const numberOfSamplePointsOnRadius = Math.floor( loopRadius / spacing );

  // All sample points share the same x coordinate, at the pickup coil's origin.
  const x = 0;

  // A point at the center of the coil
  const samplePoints: Vector2[] = [ new Vector2( x, 0 ) ];

  // Points below and above the center
  let y = 0;
  for ( let i = 0; i < numberOfSamplePointsOnRadius; i++ ) {
    y += spacing;
    samplePoints.push( new Vector2( x, y ) );
    samplePoints.push( new Vector2( x, -y ) );
  }

  return samplePoints;
}

faradaysElectromagneticLab.register( 'PickupCoil', PickupCoil );