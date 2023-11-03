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
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';


export default class BarMagnetPanel extends Panel {

  public constructor( barMagnet: BarMagnet, seeInsideBarMagenetProperty: Property<boolean>, tandem: Tandem ) {

    const titleText = new Text( FaradaysElectromagneticLabStrings.barMagnetStringProperty, {
      font: FELConstants.TITLE_FONT
    } );

    //TODO This control should be %, while barMagnet.strengthProperty is gauss.
    const strengthNumberControl = new NumberControl( FaradaysElectromagneticLabStrings.strengthColonStringProperty,
      barMagnet.strengthProperty, barMagnet.strengthProperty.range,
      combineOptions<NumberControlOptions>( {}, FELConstants.NUMBER_CONTROL_OPTIONS, {
        tandem: tandem.createTandem( 'strengthNumberControl' )
      } ) );

    const flipPolarityButton = new TextPushButton( FaradaysElectromagneticLabStrings.flipPolarityStringProperty, {
      font: FELConstants.CONTROL_FONT,
      //TODO listener
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
      children: [
        titleText,
        strengthNumberControl,
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