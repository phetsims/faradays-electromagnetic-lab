// Copyright 2023, University of Colorado Boulder

/**
 * Magnet is the abstract base class for all magnets in this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  strengthRange: RangeWithValue; // range and initial value for strengthProperty, in gauss
};

export type MagnetOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class Magnet extends PhetioObject {

  public readonly positionProperty: Property<Vector2>;
  public readonly rotationProperty: Property<number>;
  public readonly enabledProperty: Property<boolean>;
  public readonly strengthProperty: NumberProperty;

  protected constructor( providedOptions: MagnetOptions ) {

    const options = optionize<MagnetOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.rotationProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'rotationProperty' )
    } );

    this.enabledProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'enabledProperty' )
    } );

    this.strengthProperty = new NumberProperty( options.strengthRange.defaultValue, {
      units: 'gauss',
      range: options.strengthRange,
      tandem: options.tandem.createTandem( 'strengthProperty' )
    } );
  }

  public reset(): void {
    this.positionProperty.reset();
    this.rotationProperty.reset();
    this.enabledProperty.reset();
    this.strengthProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'Magnet', Magnet );