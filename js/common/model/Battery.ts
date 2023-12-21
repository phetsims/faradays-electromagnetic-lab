// Copyright 2023, University of Colorado Boulder

/**
 * Battery is the model for a simple DC battery, used to power the electromagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import CurrentSource from './CurrentSource.js';

export default class Battery extends CurrentSource {

  public constructor( tandem: Tandem ) {
    super( {
      amplitude: 1,
      maxVoltage: 10, // volts
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'Battery', Battery );