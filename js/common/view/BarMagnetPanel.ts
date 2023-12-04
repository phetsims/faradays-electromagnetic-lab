// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetPanel is the panel that contains controls for changing properties of the bar magnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnet from '../model/BarMagnet.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import { Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import { combineOptions, optionize3 } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import BarMagnetStrengthControl from './BarMagnetStrengthControl.js';
import Compass from '../model/Compass.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = {
  seeInsideProperty?: Property<boolean>;
};

type BarMagnetPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

export default class BarMagnetPanel extends Panel {

  public constructor( barMagnet: BarMagnet, compass: Compass, providedOptions: BarMagnetPanelOptions ) {

    const options = optionize3<BarMagnetPanelOptions, StrictOmit<SelfOptions, 'seeInsideProperty'>, PanelOptions>()(
      {}, FELConstants.PANEL_OPTIONS, providedOptions );

    const titleText = new Text( FaradaysElectromagneticLabStrings.barMagnetStringProperty, {
      font: FELConstants.TITLE_FONT
    } );

    const strengthControl = new BarMagnetStrengthControl( barMagnet.strengthProperty,
      options.tandem.createTandem( 'strengthControl' ) );

    const flipPolarityButton = new TextPushButton( FaradaysElectromagneticLabStrings.flipPolarityStringProperty, {
      font: FELConstants.CONTROL_FONT,
      listener: () => {
        barMagnet.flipPolarity();
        compass.startMovingNow();
      },
      layoutOptions: { stretch: false },
      tandem: options.tandem.createTandem( 'flipPolarityButton' )
    } );

    const contentChildren: Node[] = [
      titleText,
      strengthControl,
      flipPolarityButton
    ];

    // Optional 'See Inside' checkbox
    if ( options.seeInsideProperty ) {
      const seeInsideText = new Text( FaradaysElectromagneticLabStrings.seeInsideStringProperty, {
        font: FELConstants.CONTROL_FONT
      } );
      const seeInsideCheckbox = new Checkbox( options.seeInsideProperty, seeInsideText,
        combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
          tandem: options.tandem.createTandem( 'seeIndexCheckbox' )
        } ) );
      contentChildren.push( seeInsideCheckbox );
    }

    const content = new VBox( combineOptions<VBoxOptions>( {}, FELConstants.VBOX_OPTIONS, {
      children: contentChildren
    } ) );

    super( content, options );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetPanel', BarMagnetPanel );