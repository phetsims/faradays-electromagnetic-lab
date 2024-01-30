// Copyright 2023-2024, University of Colorado Boulder

/**
 * PickupCoilDebuggerPanel is a movable panel that displays quantities associated with a PickupCoil. This is intended to
 * be used solely for development and debugging. It is not intended to be displayed in the production version. It does
 * not support switching between gauss and tesla, alternative input, and translated strings.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { DragListener, GridBox, RichText, RichTextOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import PickupCoil from '../model/PickupCoil.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';

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

export default class PickupCoilDebuggerPanel extends Panel {

  public constructor( pickupCoil: PickupCoil ) {

    const averageBxStringProperty = new DerivedStringProperty( [ pickupCoil.averageBxProperty ],
      averageBx => `${Utils.toFixed( averageBx, 2 )} G` );

    const fluxStringProperty = new DerivedStringProperty( [ pickupCoil.fluxProperty ],
      flux => `${Utils.toFixed( flux, 0 )} Wb` );

    const deltaFluxStringProperty = new DerivedStringProperty( [ pickupCoil.deltaFluxProperty ],
      deltaFlux => `${Utils.toFixed( deltaFlux, 0 )} Wb` );

    const emfStringProperty = new DerivedStringProperty( [ pickupCoil.emfProperty ],
      emf => `${Utils.toFixed( emf, 0 )} V` );

    const titleText = new Text( 'Pickup Coil debugger', {
      font: FELConstants.TITLE_FONT
    } );

    const gridBox = new GridBox( {
      spacing: 5,
      columns: [
        // Labels
        [
          new RichText( 'Avg B<sub>x</sub> =', LABEL_TEXT_OPTIONS ),
          new RichText( `${PHI} =`, LABEL_TEXT_OPTIONS ),
          new RichText( `${DELTA_PHI} =`, LABEL_TEXT_OPTIONS ),
          new RichText( 'EMF =', LABEL_TEXT_OPTIONS )
        ],

        // Values
        [
          new RichText( averageBxStringProperty, VALUE_TEXT_OPTIONS ),
          new RichText( fluxStringProperty, VALUE_TEXT_OPTIONS ),
          new RichText( deltaFluxStringProperty, VALUE_TEXT_OPTIONS ),
          new RichText( emfStringProperty, VALUE_TEXT_OPTIONS )
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

    super( content, combineOptions<PanelOptions>( {}, FELConstants.PANEL_OPTIONS, {
      visibleProperty: pickupCoil.debuggerPanelVisibleProperty,
      cursor: 'pointer',
      preferredWidth: 175, // set empirically so that the panel does not resize
      layoutOptions: {
        stretch: false
      }
    } ) );

    // This panel can be relocated by dragging it.
    this.addInputListener( new DragListener( {
      translateNode: true,
      tandem: Tandem.OPT_OUT
    } ) );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilDebuggerPanel', PickupCoilDebuggerPanel );