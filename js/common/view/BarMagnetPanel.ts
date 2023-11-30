// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetPanel is the panel that contains controls for changing properties of the bar magnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnet from '../model/BarMagnet.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Property from '../../../../axon/js/Property.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import BarMagnetStrengthControl from './BarMagnetStrengthControl.js';
import Compass from '../model/Compass.js';

export default class BarMagnetPanel extends Panel {

  public constructor( barMagnet: BarMagnet,
                      seeInsideBarMagenetProperty: Property<boolean>,
                      compass: Compass,
                      tandem: Tandem ) {

    const titleText = new Text( FaradaysElectromagneticLabStrings.barMagnetStringProperty, {
      font: FELConstants.TITLE_FONT
    } );

    const strengthControl = new BarMagnetStrengthControl( barMagnet.strengthProperty,
      tandem.createTandem( 'strengthControl' ) );

    const flipPolarityButton = new TextPushButton( FaradaysElectromagneticLabStrings.flipPolarityStringProperty, {
      font: FELConstants.CONTROL_FONT,
      listener: () => {
        barMagnet.flipPolarity();
        compass.startMovingNow();
      },
      layoutOptions: { stretch: false },
      tandem: tandem.createTandem( 'flipPolarityButton' )
    } );

    const seeInsideText = new Text( FaradaysElectromagneticLabStrings.seeInsideStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );
    const seeIndexCheckbox = new Checkbox( seeInsideBarMagenetProperty, seeInsideText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: tandem.createTandem( 'seeIndexCheckbox' )
      } ) );

    const content = new VBox( {
      align: 'left',
      spacing: 15,
      stretch: true,
      children: [
        titleText,
        strengthControl,
        flipPolarityButton,
        seeIndexCheckbox
      ]
    } );

    super( content, combineOptions<PanelOptions>( {}, FELConstants.PANEL_OPTIONS, {
      tandem: tandem
    } ) );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetPanel', BarMagnetPanel );