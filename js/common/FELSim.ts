// Copyright 2024, University of Colorado Boulder

/**
 * FELSim is the subclass of Sim used by all sims in the faradays-electromagnetic-lab family.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import Sim from '../../../joist/js/Sim.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import FELConstants from './FELConstants.js';
import PreferencesModel from '../../../joist/js/preferences/PreferencesModel.js';
import FELPreferencesNode from './view/preferences/FELPreferencesNode.js';
import BarMagnetScreen from '../bar-magnet/BarMagnetScreen.js';
import PickupCoilScreen from '../pickup-coil/PickupCoilScreen.js';
import ElectromagnetScreen from '../electromagnet/ElectromagnetScreen.js';
import TransformerScreen from '../transformer/TransformerScreen.js';
import GeneratorScreen from '../generator/GeneratorScreen.js';

type FELScreen = BarMagnetScreen | PickupCoilScreen | ElectromagnetScreen | TransformerScreen | GeneratorScreen;

export default class FELSim extends Sim {

  /**
   * @param titleStringProperty
   * @param screens
   * @param hasEarthFeature - Whether the sim has the feature that shows the alignment of a bar magnet with planet Earth.
   */
  public constructor( titleStringProperty: TReadOnlyProperty<string>, screens: FELScreen[], hasEarthFeature = true ) {

    super( titleStringProperty, screens, {
      webgl: true, // Enabled for high-performance scenery.Sprites

      // Remove ScreenViews that are not active, to minimize WebGL contexts, see https://github.com/phetsims/faradays-electromagnetic-lab/issues/153
      detachInactiveScreenViews: true,

      credits: FELConstants.CREDITS,
      phetioDesigned: true,
      preferencesModel: new PreferencesModel( {
        visualOptions: {
          supportsProjectorMode: true
        },
        simulationOptions: {
          customPreferences: [ {
            createContent: tandem => new FELPreferencesNode( {
              hasEarthFeature: hasEarthFeature,
              tandem: tandem.createTandem( 'simPreferences' )
            } )
          } ]
        }
      } )
    } );
  }
}

faradaysElectromagneticLab.register( 'FELSim', FELSim );