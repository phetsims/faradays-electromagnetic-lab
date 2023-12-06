// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickupCoil from './PickupCoil.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

export default class LightBulb {

  private readonly pickupCoil: PickupCoil;

  // Writeable by developer controls only
  public readonly glowScaleProperty: NumberProperty;

  public constructor( pickupCoil: PickupCoil, tandem: Tandem ) {

    this.pickupCoil = pickupCoil;

    this.glowScaleProperty = new NumberProperty( 15, {
      range: new Range( 1, 100 )
    } );
  }
}

faradaysElectromagneticLab.register( 'LightBulb', LightBulb );