// Copyright 2023, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import PickupCoilScreen from './pickup-coil/PickupCoilScreen.js';
import FaradaysElectromagneticLabStrings from './FaradaysElectromagneticLabStrings.js';
import './common/FELQueryParameters.js';
import BarMagnetScreen from './bar-magnet/BarMagnetScreen.js';
import ElectromagnetScreen from './electromagnet/ElectromagnetScreen.js';
import TransformerScreen from './transformer/TransformerScreen.js';
import GeneratorScreen from './generator/GeneratorScreen.js';

simLauncher.launch( () => {

  const titleStringProperty = FaradaysElectromagneticLabStrings[ 'faradays-electromagnetic-lab' ].titleStringProperty;

  const screens = [
    new BarMagnetScreen( { tandem: Tandem.ROOT.createTandem( 'barMagnetScreen' ) } ),
    new PickupCoilScreen( { tandem: Tandem.ROOT.createTandem( 'pickupCoilScreen' ) } ),
    new ElectromagnetScreen( { tandem: Tandem.ROOT.createTandem( 'electromagnetScreen' ) } ),
    new TransformerScreen( { tandem: Tandem.ROOT.createTandem( 'transformerScreen' ) } ),
    new GeneratorScreen( { tandem: Tandem.ROOT.createTandem( 'generatorScreen' ) } )
  ];

  const options: SimOptions = {

    //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/2 fill in credits
    credits: {
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      contributors: '',
      qualityAssurance: '',
      graphicArts: '',
      soundDesign: '',
      thanks: ''
    }
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
} );