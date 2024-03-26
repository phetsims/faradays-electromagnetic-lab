// Copyright 2023-2024, University of Colorado Boulder

/**
 * DCPowerSupply is the model for a DC power supply, used to power the electromagnet.
 *
 * This is based on Battery.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import CurrentSource from './CurrentSource.js';

const MAX_VOLTAGE = 10; // V

// REVIEW - This is not really controlling voltage, it's controlling current. Adding loops to the wire will increase its resistance,
// but the current does not change. With a constant voltage, this would not be the case. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/118 CM: There is no resistance in this model.
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