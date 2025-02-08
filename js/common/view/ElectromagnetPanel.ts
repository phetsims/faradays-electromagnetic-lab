// Copyright 2023-2025, University of Colorado Boulder

/**
 * ElectromagnetPanel is the panel that contains controls for changing Properties of the electromagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELConstants from '../FELConstants.js';
import Electromagnet from '../model/Electromagnet.js';
import CurrentCheckbox from './CurrentCheckbox.js';
import CurrentSourceControl from './CurrentSourceControl.js';
import NumberOfLoopsControl from './NumberOfLoopsControl.js';

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

    // 'Electrons' or 'Conventional Current' checkbox
    const currentCheckbox = new CurrentCheckbox( electromagnet.coil.currentVisibleProperty,
      electromagnet.coil.currentFlowProperty, tandem.createTandem( 'currentCheckbox' ) );

    const contentChildren: Node[] = [
      titleText,
      currentSourceControl,
      numberOfLoopsControl,
      magneticFieldCheckbox,
      currentCheckbox
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