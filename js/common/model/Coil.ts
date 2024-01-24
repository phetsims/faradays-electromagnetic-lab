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

  // This is a quantity that we made up. It is a percentage that describes the amount of current relative to some
  // maximum current in the model, and direction of that current. View components can use this value to determine
  // how they should behave (eg, how far to move a voltmeter needle, how bright to make a lightbulb, etc.)
  public readonly currentAmplitudeProperty: TReadOnlyProperty<number>;

  // Whether electrons are visible in the coil in the view
  public readonly electronsVisibleProperty: Property<boolean>;

  // *** Writeable via developer controls only, when running with &dev query parameter. ***
  // Scale used for electron speed in the view.
  public readonly electronSpeedScaleProperty: NumberProperty;

  public constructor( currentAmplitudeProperty: TReadOnlyProperty<number>, providedOptions: CoilOptions ) {

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

    this.wireWidth = options.wireWidth;
    this.loopSpacing = options.loopSpacing;
    this.maxLoopArea = options.maxLoopArea;

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

    this.currentAmplitudeProperty = currentAmplitudeProperty;

    this.electronsVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'electronsVisibleProperty' ),
      phetioFeatured: true
    } );

    this.electronSpeedScaleProperty = new NumberProperty( options.electronSpeedScale, {
      range: new Range( 1, 100 )
      // Do not instrument. This is a PhET developer Property.
    } );
  }

  public reset(): void {
    this.numberOfLoopsProperty.reset();
    this.loopAreaPercentProperty.reset();
    this.electronsVisibleProperty.reset();
    // Do not reset electronSpeedScaleProperty.
  }

  /**
   * Gets the current radius of one loop of the coil.
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
}

faradaysElectromagneticLab.register( 'Coil', Coil );