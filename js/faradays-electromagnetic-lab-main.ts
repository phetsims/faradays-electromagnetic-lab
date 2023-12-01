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
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import FELConstants from './common/FELConstants.js';
import FELPreferencesNode from './common/view/FELPreferencesNode.js';

simLauncher.launch( () => {

  const titleStringProperty = FaradaysElectromagneticLabStrings[ 'faradays-electromagnetic-lab' ].titleStringProperty;

  const screens = [
    new BarMagnetScreen( Tandem.ROOT.createTandem( 'barMagnetScreen' ) ),
    new PickupCoilScreen( Tandem.ROOT.createTandem( 'pickupCoilScreen' ) ),
    new ElectromagnetScreen( Tandem.ROOT.createTandem( 'electromagnetScreen' ) ),
    new TransformerScreen( Tandem.ROOT.createTandem( 'transformerScreen' ) ),
    new GeneratorScreen( Tandem.ROOT.createTandem( 'generatorScreen' ) )
  ];

  const options: SimOptions = {
    credits: FELConstants.CREDITS,
    preferencesModel: new PreferencesModel( {
      visualOptions: {
        supportsProjectorMode: true
      },
      simulationOptions: {
        customPreferences: [ {
          createContent: tandem => new FELPreferencesNode( tandem.createTandem( 'simPreferences' ) )
        } ]
      }
    } )
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
} );