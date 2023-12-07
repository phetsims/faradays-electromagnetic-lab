// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickupCoil from './PickupCoil.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import FELQueryParameters, { LIGHT_BULB_GLOW_SCALE_RANGE } from '../FELQueryParameters.js';

export default class LightBulb {

  private readonly pickupCoil: PickupCoil;

  // Scales the modulation of alpha, used to make the light bulb glow.
  // Writeable by developer controls only.
  public readonly devGlowScaleProperty: NumberProperty;

  public constructor( pickupCoil: PickupCoil, tandem: Tandem ) {

    this.pickupCoil = pickupCoil;

    this.devGlowScaleProperty = new NumberProperty( FELQueryParameters.lightBulbGlowScale, {
      range: LIGHT_BULB_GLOW_SCALE_RANGE
      // Do not instrument. This is a PhET developer Property.
    } );
  }
}

faradaysElectromagneticLab.register( 'LightBulb', LightBulb );