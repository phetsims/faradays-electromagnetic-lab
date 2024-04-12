// Copyright 2023-2024, University of Colorado Boulder

/**
 * Main entry point for the 'Faraday's Electromagnetic Lab' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import PickupCoilScreen from './pickup-coil/PickupCoilScreen.js';
import FaradaysElectromagneticLabStrings from './FaradaysElectromagneticLabStrings.js';
import './common/FELQueryParameters.js';
import BarMagnetScreen from './bar-magnet/BarMagnetScreen.js';
import ElectromagnetScreen from './electromagnet/ElectromagnetScreen.js';
import TransformerScreen from './transformer/TransformerScreen.js';
import GeneratorScreen from './generator/GeneratorScreen.js';
import FELSim from './common/FELSim.js';
import FELPreferences from './common/model/FELPreferences.js';

simLauncher.launch( () => {
  const preferences = new FELPreferences();
  const titleStringProperty = FaradaysElectromagneticLabStrings[ 'faradays-electromagnetic-lab' ].titleStringProperty;
  const screens = [
    new BarMagnetScreen( preferences, Tandem.ROOT.createTandem( 'barMagnetScreen' ) ),
    new PickupCoilScreen( preferences, Tandem.ROOT.createTandem( 'pickupCoilScreen' ) ),
    new ElectromagnetScreen( preferences, Tandem.ROOT.createTandem( 'electromagnetScreen' ) ),
    new TransformerScreen( preferences, Tandem.ROOT.createTandem( 'transformerScreen' ) ),
    new GeneratorScreen( preferences, Tandem.ROOT.createTandem( 'generatorScreen' ) )
  ];
  const sim = new FELSim( titleStringProperty, screens, preferences );
  sim.start();
} );