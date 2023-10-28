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
import BarMagnetScreenView from './view/BarMagnetScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import BarMagnetModel from './model/BarMagnetModel.js';

type SelfOptions = {
  //TODO add options that are specific to BarMagnetScreen here
};

type BarMagnetScreenOptions = SelfOptions & ScreenOptions;

export default class BarMagnetScreen extends Screen<BarMagnetModel, BarMagnetScreenView> {

  public constructor( providedOptions: BarMagnetScreenOptions ) {

    const options = optionize<BarMagnetScreenOptions, SelfOptions, ScreenOptions>()( {
      name: FaradaysElectromagneticLabStrings.screen.barMagnetStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: FELColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new BarMagnetModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new BarMagnetScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetScreen', BarMagnetScreen );