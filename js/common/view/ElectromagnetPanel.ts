// Copyright 2023, University of Colorado Boulder

/**
 * ElectromagnetPanel is the panel that contains controls for changing properties of the electromagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import NumberOfLoopsControl from './NumberOfLoopsControl.js';
import Electromagnet from '../model/Electromagnet.js';
import CurrentSourceRadioButtonGroup from './CurrentSourceRadioButtonGroup.js';

export default class ElectromagnetPanel extends Panel {

  public constructor( electromagnet: Electromagnet, tandem: Tandem ) {

    const titleText = new Text( FaradaysElectromagneticLabStrings.electromagnetStringProperty, {
      font: FELConstants.TITLE_FONT
    } );

    //TODO label as 'Current Source'?
    const currentSourceRadioButtonGroup = new CurrentSourceRadioButtonGroup( electromagnet.currentSourceProperty,
      tandem.createTandem( 'indicatorRadioButtonGroup' ) );

    const numberOfLoopsControl = new NumberOfLoopsControl( electromagnet.sourceCoil.numberOfLoopsProperty,
      tandem.createTandem( 'numberOfLoopsControl' ) );

    // 'Electrons' checkbox
    const electronsText = new Text( FaradaysElectromagneticLabStrings.electronsStringProperty, {
      font: FELConstants.CONTROL_FONT
    } );
    const electronsCheckbox = new Checkbox( electromagnet.electronsVisibleProperty, electronsText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: tandem.createTandem( 'electronsCheckbox' )
      } ) );

    const contentChildren: Node[] = [
      titleText,
      currentSourceRadioButtonGroup,
      numberOfLoopsControl,
      electronsCheckbox
    ];

    const content = new VBox( combineOptions<VBoxOptions>( {}, FELConstants.VBOX_OPTIONS, {
      children: contentChildren
    } ) );

    super( content, combineOptions<PanelOptions>( {}, FELConstants.PANEL_OPTIONS, {
      tandem: tandem
    } ) );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetPanel', ElectromagnetPanel );