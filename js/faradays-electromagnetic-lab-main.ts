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

simLauncher.launch( () => {
  const titleStringProperty = FaradaysElectromagneticLabStrings[ 'faradays-electromagnetic-lab' ].titleStringProperty;
  const screens = [
    new BarMagnetScreen( Tandem.ROOT.createTandem( 'barMagnetScreen' ) ),
    new PickupCoilScreen( Tandem.ROOT.createTandem( 'pickupCoilScreen' ) ),
    new ElectromagnetScreen( Tandem.ROOT.createTandem( 'electromagnetScreen' ) ),
    new TransformerScreen( Tandem.ROOT.createTandem( 'transformerScreen' ) ),
    new GeneratorScreen( Tandem.ROOT.createTandem( 'generatorScreen' ) )
  ];
  const sim = new FELSim( titleStringProperty, screens );
  sim.start();
} );