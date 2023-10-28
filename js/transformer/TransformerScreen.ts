// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import TransformerModel from './model/TransformerModel.js';
import TransformerScreenView from './view/TransformerScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import FELColors from '../common/FELColors.js';

type SelfOptions = {
  //TODO add options that are specific to TransformerScreen here
};

type TransformerScreenOptions = SelfOptions & ScreenOptions;

export default class TransformerScreen extends Screen<TransformerModel, TransformerScreenView> {

  public constructor( providedOptions: TransformerScreenOptions ) {

    const options = optionize<TransformerScreenOptions, SelfOptions, ScreenOptions>()( {
      name: FaradaysElectromagneticLabStrings.screen.transformerStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: FELColors.screenBackgroundColorProperty,
      showUnselectedHomeScreenIconFrame: true
    }, providedOptions );

    super(
      () => new TransformerModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new TransformerScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

faradaysElectromagneticLab.register( 'TransformerScreen', TransformerScreen );