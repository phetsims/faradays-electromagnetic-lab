// Copyright 2023-2024, University of Colorado Boulder

/**
 * Coil is the base class for all coils.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Range from '../../../../dot/js/Range.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import FELMovable, { FELMovableOptions } from './FELMovable.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

type SelfOptions = {

  // range and initial value for numberOfLoopsProperty
  numberOfLoopsRange: RangeWithValue;

  // range and initial value for loopRadiusProperty, unitless
  loopRadiusRange: RangeWithValue;

  // the width of the wire that makes up the coil
  wireWidth?: number;

  // Horizontal spacing between loops in the coil. Values that are closer to wireWidth result in more closely-packed loops.
  loopSpacing?: number;

  // Initial value of electronSpeedScaleProperty, a developer control.
  electronSpeedScale?: number;
};

export type CoilOptions = SelfOptions & FELMovableOptions;

export default class Coil extends FELMovable {

  // Width of the wire that makes up the coil.
  public readonly wireWidth: number;

  // Horizontal spacing between loops in the coil. Values that are closer to wireWidth result in more closely-packed loops.
  public readonly loopSpacing: number;

  // Number of loops in the coil
  public readonly numberOfLoopsProperty: NumberProperty;

  // Radius of one loop
  public readonly loopRadiusProperty: NumberProperty;

  // This is a quantity that we made up. It is a percentage that describes the amount of current relative to some
  // maximum current in the model, and direction of that current. View components can use this value to determine
  // how they should behave (eg, how far to move a voltmeter needle, how bright to make a lightbulb, etc.)
  public readonly currentAmplitudeProperty: TReadOnlyProperty<number>;

  // *** Writeable via developer controls only, when running with &dev query parameter. ***
  // Scale used for electron speed in the view.
  public readonly electronSpeedScaleProperty: NumberProperty;

  // Whether electrons are visible in the coil in the view
  public readonly electronsVisibleProperty: Property<boolean>;

  protected constructor( currentAmplitudeProperty: TReadOnlyProperty<number>, providedOptions: CoilOptions ) {

    const options = optionize<CoilOptions, SelfOptions, FELMovableOptions>()( {

      // SelfOptions
      wireWidth: 16,
      loopSpacing: 25,
      electronSpeedScale: 1
    }, providedOptions );

    assert && assert( options.loopSpacing >= options.wireWidth );

    super( options );

    this.wireWidth = options.wireWidth;

    this.loopSpacing = options.loopSpacing;

    this.numberOfLoopsProperty = new NumberProperty( options.numberOfLoopsRange.defaultValue, {
      numberType: 'Integer',
      range: options.numberOfLoopsRange,
      tandem: options.tandem.createTandem( 'numberOfLoopsProperty' ),
      phetioFeatured: true
    } );

    this.loopRadiusProperty = new NumberProperty( options.loopRadiusRange.defaultValue, {
      range: options.loopRadiusRange,
      tandem: options.tandem.createTandem( 'loopRadiusProperty' ),
      phetioFeatured: true
    } );

    this.currentAmplitudeProperty = currentAmplitudeProperty;

    this.electronSpeedScaleProperty = new NumberProperty( options.electronSpeedScale, {
      range: new Range( 1, 100 )
      // Do not instrument. This is a PhET developer Property.
    } );

    this.electronsVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'electronsVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public override reset(): void {
    super.reset();
    this.numberOfLoopsProperty.reset();
    this.loopRadiusProperty.reset();
    this.electronsVisibleProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'Coil', Coil );