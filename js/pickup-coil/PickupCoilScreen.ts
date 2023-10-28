// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import faradaysElectromagneticLab from '../faradaysElectromagneticLab.js';
import PickupCoilModel from './model/PickupCoilModel.js';
import PickupCoilScreenView from './view/PickupCoilScreenView.js';
import FaradaysElectromagneticLabStrings from '../FaradaysElectromagneticLabStrings.js';
import FELColors from '../common/FELColors.js';

type SelfOptions = {
  //TODO add options that are specific to PickupCoilScreen here
};

type PickupCoilScreenOptions = SelfOptions & ScreenOptions;

export default class PickupCoilScreen extends Screen<PickupCoilModel, PickupCoilScreenView> {

  public constructor( providedOptions: PickupCoilScreenOptions ) {

    const options = optionize<PickupCoilScreenOptions, SelfOptions, ScreenOptions>()( {
      name: FaradaysElectromagneticLabStrings.screen.pickupCoilStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: FELColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new PickupCoilModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new PickupCoilScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilScreen', PickupCoilScreen );