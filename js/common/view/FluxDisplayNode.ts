// Copyright 2023, University of Colorado Boulder

/**
 * FluxDisplayNode displays quantities associated with a PickupCoil that are useful during development and debugging.
 * This is not intended to be displayed in the production version. It does not support switching between gauss and tesla,
 * alternative input, and translated strings.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { DragListener, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import PickupCoil from '../model/PickupCoil.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import Utils from '../../../../dot/js/Utils.js';

const PHI = '\u03A6';
const DELTA_PHI = `${PHI}\u2206`;
const DECIMAL_PLACES = 3;

const richTextOptions = {
  font: new PhetFont( 12 )
};

export default class FluxDisplayNode extends Panel {

  public constructor( pickupCoil: PickupCoil ) {

    const averageBxStringProperty = new DerivedProperty( [ pickupCoil.averageBxProperty ],
      averageBx => `Avg B<sub>x</sub> = ${Utils.toFixed( averageBx, DECIMAL_PLACES )} G` );

    const fluxStringProperty = new DerivedProperty( [ pickupCoil.fluxProperty ],
      flux => `${PHI} = ${Utils.toFixed( flux, DECIMAL_PLACES )} Wb` );

    const deltaFluxStringProperty = new DerivedProperty( [ pickupCoil.deltaFluxProperty ],
      deltaFlux => `${DELTA_PHI} = ${Utils.toFixed( deltaFlux, DECIMAL_PLACES )} Wb` );

    const emfStringProperty = new DerivedProperty( [ pickupCoil.emfProperty ],
      emf => `EMF = ${Utils.toFixed( emf, DECIMAL_PLACES )} V` );

    const content = new VBox( {
      align: 'left',
      spacing: 5,
      children: [
        new Text( 'Flux Display', {
          font: FELConstants.TITLE_FONT
        } ),
        new RichText( averageBxStringProperty, richTextOptions ),
        new RichText( fluxStringProperty, richTextOptions ),
        new RichText( deltaFluxStringProperty, richTextOptions ),
        new RichText( emfStringProperty, richTextOptions )
      ]
    } );

    super( content, combineOptions<PanelOptions>( {}, FELConstants.PANEL_OPTIONS, {
      visibleProperty: pickupCoil.devFluxVisibleProperty,
      cursor: 'pointer',
      preferredWidth: 150, // set empirically so that the panel does not resize
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