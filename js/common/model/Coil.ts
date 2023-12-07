// Copyright 2023, University of Colorado Boulder

/**
 * Coil is the abstract base class for all coils.
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

type SelfOptions = {
  numberOfLoopsRange: RangeWithValue; // range and initial value for numberOfLoopsProperty
  loopRadiusRange: RangeWithValue; // range and initial value for loopRadiusProperty, unitless
  wireWidth?: number;
  loopSpacing?: number;
  electronSpeedScale?: number;
};

export type CoilOptions = SelfOptions & FELMovableOptions;

export default abstract class Coil extends FELMovable {

  public readonly wireWidth: number; //TODO document

  public readonly loopSpacing: number; //TODO document

  // Number of loops in the coil
  public readonly numberOfLoopsProperty: NumberProperty;

  // Radius of one loop
  public readonly loopRadiusProperty: NumberProperty;

  // This is a quantity that we made up. It is a percentage that describes the amount of current relative to some
  // maximum current in the model, and direction of that current. View components can use this value to determine
  // how they should behave (eg, how far to move a voltmeter needle, how bright to make a lightbulb, etc.)
  public readonly currentAmplitudeProperty: TReadOnlyProperty<number>;
  protected readonly _currentAmplitudeProperty: NumberProperty;

  // *** Writeable via developer controls only, when running with &dev query parameter. ***
  // Scale used for electron speed in the view.
  public readonly devElectronSpeedScaleProperty: NumberProperty;

  protected constructor( providedOptions: CoilOptions ) {

    const options = optionize<CoilOptions, SelfOptions, FELMovableOptions>()( {

      // SelfOptions
      wireWidth: 16,
      loopSpacing: 25,
      electronSpeedScale: 1
    }, providedOptions );

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

    this._currentAmplitudeProperty = new NumberProperty( 0, {
      range: new Range( -1, 1 ),
      tandem: options.tandem.createTandem( 'currentAmplitudeProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only'
    } );
    this.currentAmplitudeProperty = this._currentAmplitudeProperty;

    this.devElectronSpeedScaleProperty = new NumberProperty( options.electronSpeedScale, {
      range: new Range( 1, 100 )
      // Do not instrument. This is a PhET developer Property.
    } );
  }

  public override reset(): void {
    super.reset();
    this.numberOfLoopsProperty.reset();
    this.loopRadiusProperty.reset();
    this._currentAmplitudeProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'Coil', Coil );