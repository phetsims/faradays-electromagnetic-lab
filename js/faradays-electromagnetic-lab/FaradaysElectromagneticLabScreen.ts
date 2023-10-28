// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import FaradaysElectromagneticLabColors from '../common/FaradaysElectromagneticLabColors.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabModel from './model/FaradaysElectromagneticLabModel.js';
import FaradaysElectromagneticLabScreenView from './view/FaradaysElectromagneticLabScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';

type SelfOptions = {
  //TODO add options that are specific to FaradaysElectromagneticLabScreen here
};

type FaradaysElectromagneticLabScreenOptions = SelfOptions & ScreenOptions;

export default class FaradaysElectromagneticLabScreen extends Screen<FaradaysElectromagneticLabModel, FaradaysElectromagneticLabScreenView> {

  public constructor( providedOptions: FaradaysElectromagneticLabScreenOptions ) {

    const options = optionize<FaradaysElectromagneticLabScreenOptions, SelfOptions, ScreenOptions>()( {
      name: FaradaysElectromagneticLabStrings.screen.nameStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: FaradaysElectromagneticLabColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new FaradaysElectromagneticLabModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new FaradaysElectromagneticLabScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

faradaysElectromagneticLab.register( 'FaradaysElectromagneticLabScreen', FaradaysElectromagneticLabScreen );