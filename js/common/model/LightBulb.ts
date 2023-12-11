// Copyright 2023, University of Colorado Boulder

//TODO Factor out Indicator base class (with a better name), possibly delete Indicator string union?
/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickupCoil from './PickupCoil.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Range from '../../../../dot/js/Range.js';

export default class LightBulb extends PhetioObject {

  private readonly pickupCoil: PickupCoil;

  // *** Writeable via developer controls only, when running with &dev query parameter. ***
  // Scales the modulation of alpha that is used to make the light bulb glow.
  public readonly glowScaleProperty: NumberProperty;

  public constructor( pickupCoil: PickupCoil, tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioState: false
    } );

    this.pickupCoil = pickupCoil;

    this.glowScaleProperty = new NumberProperty( 15, {
      range: new Range( 1, 100 )
      // Do not instrument. This is a PhET developer Property.
    } );
  }

  public reset(): void {
    //TODO
  }

  public step( dt: number ): void {
    //TODO
  }
}

faradaysElectromagneticLab.register( 'LightBulb', LightBulb );