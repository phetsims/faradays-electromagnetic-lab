// Copyright 2023-2024, University of Colorado Boulder

/**
 * PickupCoilDebuggerPanel is a movable panel that displays quantities associated with a PickupCoil. This is intended
 * to be used solely for development and debugging, not in the production version. It does not support localization,
 * alternative input, or switching magnetic units.
 *
 * This is based on FluxDisplayGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { DragListener, GridBox, NodeTranslationOptions, RichText, RichTextOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import PickupCoil from '../model/PickupCoil.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

const PHI = '\u03A6'; // flux
const DELTA_PHI = `\u2206${PHI}`; // delta flux

const LABEL_TEXT_OPTIONS: RichTextOptions = {
  font: new PhetFont( 12 ),
  layoutOptions: {
    xAlign: 'right'
  }
};

const VALUE_TEXT_OPTIONS: RichTextOptions = {
  font: new PhetFont( 12 ),
  layoutOptions: {
    xAlign: 'left'
  }
};

type SelfOptions = EmptySelfOptions;

type PickupCoilDebuggerPanelOptions = SelfOptions & NodeTranslationOptions;

export default class PickupCoilDebuggerPanel extends Panel {

  public constructor( pickupCoil: PickupCoil, providedOptions?: PickupCoilDebuggerPanelOptions ) {

    const options = optionize4<PickupCoilDebuggerPanelOptions, SelfOptions, PanelOptions>()( {}, FELConstants.PANEL_OPTIONS, {
      visibleProperty: pickupCoil.debuggerPanelVisibleProperty,
      cursor: 'pointer',
      preferredWidth: 175, // set empirically so that the panel does not resize
      layoutOptions: {
        stretch: false
      }
    }, providedOptions );

    // Use Number.toLocaleString to format these values with comma separators.
    const fluxStringProperty = new DerivedStringProperty( [ pickupCoil.fluxProperty ],
      flux => `${Utils.toFixedNumber( flux, 0 ).toLocaleString()}` );

    const deltaFluxStringProperty = new DerivedStringProperty( [ pickupCoil.deltaFluxProperty ],
      deltaFlux => `${Utils.toFixedNumber( deltaFlux, 0 ).toLocaleString()}` );

    const emfStringProperty = new DerivedStringProperty( [ pickupCoil.emfProperty ],
      emf => `${Utils.toFixedNumber( emf, 0 ).toLocaleString()}` );

    const maxEMFProperty = new NumberProperty( pickupCoil.emfProperty.value );
    pickupCoil.emfProperty.link( emf => {
      if ( emf > maxEMFProperty.value ) {
        maxEMFProperty.value = emf;
      }
    } );

    const maxEMFStringProperty = new DerivedStringProperty( [ maxEMFProperty ],
      maxEMF => `${Utils.toFixedNumber( maxEMF, 0 ).toLocaleString()}` );

    const titleText = new Text( 'Pickup Coil Debugger', {
      font: FELConstants.TITLE_FONT
    } );

    const gridBox = new GridBox( {
      spacing: 5,
      columns: [
        // Labels
        [
          new RichText( `${PHI} =`, LABEL_TEXT_OPTIONS ),
          new RichText( `${DELTA_PHI} =`, LABEL_TEXT_OPTIONS ),
          new RichText( 'EMF =', LABEL_TEXT_OPTIONS ),
          new RichText( 'Max EMF =', LABEL_TEXT_OPTIONS )
        ],

        // Values
        [
          new RichText( fluxStringProperty, VALUE_TEXT_OPTIONS ),
          new RichText( deltaFluxStringProperty, VALUE_TEXT_OPTIONS ),
          new RichText( emfStringProperty, VALUE_TEXT_OPTIONS ),
          new RichText( maxEMFStringProperty, VALUE_TEXT_OPTIONS )
        ]
      ]
    } );

    const content = new VBox( {
      align: 'left',
      spacing: 7,
      children: [
        titleText,
        gridBox
      ]
    } );

    super( content, options );

    // This panel can be relocated by dragging it.
    this.addInputListener( new DragListener( {
      translateNode: true,
      tandem: Tandem.OPT_OUT
    } ) );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilDebuggerPanel', PickupCoilDebuggerPanel );