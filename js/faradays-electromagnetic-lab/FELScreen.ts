// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import FELColors from '../common/FELColors.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import FELModel from './model/FELModel.js';
import FELScreenView from './view/FELScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';

type SelfOptions = {
  //TODO add options that are specific to FELScreen here
};

type FELScreenOptions = SelfOptions & ScreenOptions;

export default class FELScreen extends Screen<FELModel, FELScreenView> {

  public constructor( providedOptions: FELScreenOptions ) {

    const options = optionize<FELScreenOptions, SelfOptions, ScreenOptions>()( {
      name: FaradaysElectromagneticLabStrings.screen.nameStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: FELColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new FELModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new FELScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

faradaysElectromagneticLab.register( 'FELScreen', FELScreen );