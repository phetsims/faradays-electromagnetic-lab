// Copyright 2023-2024, University of Colorado Boulder

/**
 * DCPowerSupply is the model for DC power supply, used to power the electromagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import CurrentSource from './CurrentSource.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';

const MAX_VOLTAGE = 10; // V

export default class DCPowerSupply extends CurrentSource {

  public readonly voltageProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    const voltageProperty = new NumberProperty( 10, {
      units: 'V',
      range: new Range( -MAX_VOLTAGE, MAX_VOLTAGE ),
      tandem: tandem.createTandem( 'voltageProperty' ),
      phetioFeatured: true
    } );

    super( voltageProperty, {
      maxVoltage: MAX_VOLTAGE,
      tandem: tandem
    } );

    this.voltageProperty = voltageProperty;
  }

  public reset(): void {
    this.voltageProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'DCPowerSupply', DCPowerSupply );