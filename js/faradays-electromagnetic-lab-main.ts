// Copyright 2023, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import FELScreen from './faradays-electromagnetic-lab/FELScreen.js';
import FaradaysElectromagneticLabStrings from './FaradaysElectromagneticLabStrings.js';
import './common/FELQueryParameters.js';

simLauncher.launch( () => {

  const titleStringProperty = FaradaysElectromagneticLabStrings[ 'faradays-electromagnetic-lab' ].titleStringProperty;

  const screens = [
    new FELScreen( { tandem: Tandem.ROOT.createTandem( 'faradaysElectromagneticLabScreen' ) } )
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