// Copyright 2023-2024, University of Colorado Boulder

/**
 * DCPowerSupply is the model for a DC power supply, used to power the electromagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import CurrentSource from './CurrentSource.js';

const MAX_VOLTAGE = 10; // V

export default class DCPowerSupply extends CurrentSource {

  public constructor( tandem: Tandem ) {
    super( {
      maxVoltage: MAX_VOLTAGE,
      initialVoltage: MAX_VOLTAGE,
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'DCPowerSupply', DCPowerSupply );