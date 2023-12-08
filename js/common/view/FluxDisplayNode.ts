// Copyright 2023, University of Colorado Boulder

/**
 * FluxDisplayNode displays quantities associated with a PickupCoil that are useful during development and debugging.
 * This is not intended to be displayed in the production version. It does not support switching between gauss and tesla,
 * alternative input, and translated strings.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { DragListener, GridBox, RichText, RichTextOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import PickupCoil from '../model/PickupCoil.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import Utils from '../../../../dot/js/Utils.js';

const PHI = '\u03A6';
const DELTA_PHI = `\u2206${PHI}`;
const DECIMAL_PLACES = 3;

const labelTextOptions: RichTextOptions = {
  font: new PhetFont( 12 ),
  layoutOptions: {
    xAlign: 'right'
  }
};

const valueTextOptions: RichTextOptions = {
  font: new PhetFont( 12 ),
  layoutOptions: {
    xAlign: 'left'
  }
};

export default class FluxDisplayNode extends Panel {

  public constructor( pickupCoil: PickupCoil ) {

    const averageBxStringProperty = new DerivedProperty( [ pickupCoil.averageBxProperty ],
      averageBx => `${Utils.toFixed( averageBx, DECIMAL_PLACES )} G` );

    const fluxStringProperty = new DerivedProperty( [ pickupCoil.fluxProperty ],
      flux => `${Utils.toFixed( flux, DECIMAL_PLACES )} Wb` );

    const deltaFluxStringProperty = new DerivedProperty( [ pickupCoil.deltaFluxProperty ],
      deltaFlux => `${Utils.toFixed( deltaFlux, DECIMAL_PLACES )} Wb` );

    const emfStringProperty = new DerivedProperty( [ pickupCoil.emfProperty ],
      emf => `${Utils.toFixed( emf, DECIMAL_PLACES )} V` );

    const titleText = new Text( 'Flux Display', {
      font: FELConstants.TITLE_FONT
    } );

    const gridBox = new GridBox( {
      spacing: 5,
      columns: [
        // Labels
        [
          new RichText( 'Avg B<sub>x</sub> =', labelTextOptions ),
          new RichText( `${PHI} =`, labelTextOptions ),
          new RichText( `${DELTA_PHI} =`, labelTextOptions ),
          new RichText( 'EMF =', labelTextOptions )
        ],

        // Values
        [
          new RichText( averageBxStringProperty, valueTextOptions ),
          new RichText( fluxStringProperty, valueTextOptions ),
          new RichText( deltaFluxStringProperty, valueTextOptions ),
          new RichText( emfStringProperty, valueTextOptions )
        ]
      ]
    } );

    const content = new VBox( {
      align: 'left',
      spacing: 5,
      children: [
        titleText,
        gridBox
      ]
    } );

    super( content, combineOptions<PanelOptions>( {}, FELConstants.PANEL_OPTIONS, {
      visibleProperty: pickupCoil.devFluxVisibleProperty,
      cursor: 'pointer',
      preferredWidth: 175, // set empirically so that the panel does not resize
      layoutOptions: {
        stretch: false
      }
    } ) );

    this.addInputListener( new DragListener( {
      translateNode: true
    } ) );
  }
}

faradaysElectromagneticLab.register( 'FluxDisplayNode', FluxDisplayNode );