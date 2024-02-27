// Copyright 2023-2024, University of Colorado Boulder

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
import CurrentSourceControl from './CurrentSourceControl.js';
import ElectronsCheckbox from './ElectronsCheckbox.js';

export default class ElectromagnetPanel extends Panel {

  public constructor( electromagnet: Electromagnet, tandem: Tandem ) {

    const titleText = new Text( FaradaysElectromagneticLabStrings.electromagnetStringProperty, FELConstants.PANEL_TITLE_OPTIONS );

    const currentSourceControl = new CurrentSourceControl( electromagnet,
      tandem.createTandem( 'currentSourceControl' ) );

    const numberOfLoopsControl = new NumberOfLoopsControl( electromagnet.coil.numberOfLoopsProperty,
      tandem.createTandem( 'numberOfLoopsControl' ) );

    // 'Magnetic Field' checkbox
    const magneticFieldText = new Text( FaradaysElectromagneticLabStrings.magneticFieldStringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS );
    const magneticFieldCheckbox = new Checkbox( electromagnet.fieldVisibleProperty, magneticFieldText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: tandem.createTandem( 'magneticFieldCheckbox' )
      } ) );

    // 'Electrons' checkbox
    const electronsCheckbox = new ElectronsCheckbox( electromagnet.coil.electronsVisibleProperty,
      tandem.createTandem( 'electronsCheckbox' ) );

    const contentChildren: Node[] = [
      titleText,
      currentSourceControl,
      numberOfLoopsControl,
      magneticFieldCheckbox,
      electronsCheckbox
    ];

    const content = new VBox( combineOptions<VBoxOptions>( {}, FELConstants.VBOX_OPTIONS, {
      children: contentChildren
    } ) );

    super( content, combineOptions<PanelOptions>( {}, FELConstants.PANEL_OPTIONS, {
      tandem: tandem,
      phetioFeatured: true
    } ) );

    this.addLinkedElement( electromagnet );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetPanel', ElectromagnetPanel );