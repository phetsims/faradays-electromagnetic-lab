// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnetPanel is the panel that contains controls for changing Properties of the bar magnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnet from '../model/BarMagnet.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import { Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import { combineOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import BarMagnetStrengthControl from './BarMagnetStrengthControl.js';
import Compass from '../model/Compass.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../../axon/js/Property.js';
import FELPreferences from '../model/FELPreferences.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {

  // Adds a 'Flip Polarity' button, to flip the polarity of the bar magnet.
  hasFlipPolarityButton?: boolean;

  // Providing this Property adds a 'See Inside' checkbox, to see the magnetic field inside the bar magnet.
  seeInsideProperty?: Property<boolean>;

  // Providing this Property adds an 'Earth' checkbox, to see the alignment of the bar magnet with planet Earth.
  earthVisibleProperty?: Property<boolean>;
};

type BarMagnetPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

export default class BarMagnetPanel extends Panel {

  public constructor( barMagnet: BarMagnet, compass: Compass, providedOptions: BarMagnetPanelOptions ) {

    const options = optionize4<BarMagnetPanelOptions, StrictOmit<SelfOptions, 'seeInsideProperty' | 'earthVisibleProperty'>, PanelOptions>()(
      {}, FELConstants.PANEL_OPTIONS, {

        // SelfOptions
        hasFlipPolarityButton: true,

        // BarMagnetPanelOptions
        phetioFeatured: true
      }, providedOptions );

    const titleText = new Text( FaradaysElectromagneticLabStrings.barMagnetStringProperty, FELConstants.PANEL_TITLE_OPTIONS );

    const strengthControl = new BarMagnetStrengthControl( barMagnet.strengthPercentProperty,
      options.tandem.createTandem( 'strengthControl' ) );

    const contentChildren: Node[] = [
      titleText,
      strengthControl
    ];

    // 'Magnetic Field' checkbox
    const magneticFieldText = new Text( FaradaysElectromagneticLabStrings.magneticFieldStringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS );
    const magneticFieldCheckbox = new Checkbox( barMagnet.fieldVisibleProperty, magneticFieldText,
      combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
        tandem: options.tandem.createTandem( 'magneticFieldCheckbox' )
      } ) );
    contentChildren.push( magneticFieldCheckbox );

    // Optional 'See Inside' checkbox
    if ( options.seeInsideProperty ) {
      const seeInsideText = new Text( FaradaysElectromagneticLabStrings.seeInsideStringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS );
      const seeInsideCheckbox = new Checkbox( options.seeInsideProperty, seeInsideText,
        combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
          tandem: options.tandem.createTandem( 'seeInsideCheckbox' )
        } ) );
      contentChildren.push( seeInsideCheckbox );
    }

    // Optional 'Earth' checkbox
    if ( options.earthVisibleProperty ) {
      const earthText = new Text( FaradaysElectromagneticLabStrings.earthStringProperty, FELConstants.CHECKBOX_TEXT_OPTIONS );
      const earthCheckbox = new Checkbox( options.earthVisibleProperty, earthText,
        combineOptions<CheckboxOptions>( {}, FELConstants.CHECKBOX_OPTIONS, {
          visibleProperty: FELPreferences.addEarthCheckboxProperty,
          tandem: options.tandem.createTandem( 'earthCheckbox' )
        } ) );
      contentChildren.push( earthCheckbox );
    }

    // Optional 'Flip Polarity' button
    if ( options.hasFlipPolarityButton ) {

      // When 'Earth' checkbox is checked, change button label from 'Flip Polarity' to 'Flip Earth'.
      // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/43
      let flipStringProperty: TReadOnlyProperty<string> = FaradaysElectromagneticLabStrings.flipPolarityStringProperty;
      if ( options.earthVisibleProperty ) {
        flipStringProperty = new DerivedStringProperty(
          [ options.earthVisibleProperty, FaradaysElectromagneticLabStrings.flipEarthStringProperty, FaradaysElectromagneticLabStrings.flipPolarityStringProperty ],
          ( earthVisible, flipEarthString, flipPolarityString ) => earthVisible ? flipEarthString : flipPolarityString );
      }

      const flipPolarityButton = new TextPushButton( flipStringProperty, {
        font: FELConstants.CONTROL_FONT,
        textNodeOptions: {
          maxWidth: 180
        },
        listener: () => {
          barMagnet.flipPolarity();
          compass.startMovingNow();
        },
        layoutOptions: { stretch: false },
        tandem: options.tandem.createTandem( 'flipPolarityButton' )
      } );
      contentChildren.push( flipPolarityButton );
    }

    const content = new VBox( combineOptions<VBoxOptions>( {}, FELConstants.VBOX_OPTIONS, {
      children: contentChildren
    } ) );

    super( content, options );

    this.addLinkedElement( barMagnet );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetPanel', BarMagnetPanel );