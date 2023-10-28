// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import ElectromagnetModel from './model/ElectromagnetModel.js';
import ElectromagnetScreenView from './view/ElectromagnetScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import FELColors from '../common/FELColors.js';

type SelfOptions = {
  //TODO add options that are specific to ElectromagnetScreen here
};

type ElectromagnetScreenOptions = SelfOptions & ScreenOptions;

export default class ElectromagnetScreen extends Screen<ElectromagnetModel, ElectromagnetScreenView> {

  public constructor( providedOptions: ElectromagnetScreenOptions ) {

    const options = optionize<ElectromagnetScreenOptions, SelfOptions, ScreenOptions>()( {
      name: FaradaysElectromagneticLabStrings.screen.electromagnetStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: FELColors.screenBackgroundColorProperty,
      showUnselectedHomeScreenIconFrame: true
    }, providedOptions );

    super(
      () => new ElectromagnetModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new ElectromagnetScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetScreen', ElectromagnetScreen );