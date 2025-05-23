// Copyright 2023-2025, University of Colorado Boulder

/**
 * PickupCoilDebuggerPanel is a movable panel that displays quantities associated with a PickupCoil. This is intended
 * to be used solely for development and debugging, not in the production version. It does not support localization,
 * alternative input, or switching magnetic units.
 *
 * This is based on FluxDisplayGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import GridBox from '../../../../scenery/js/layout/nodes/GridBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELConstants from '../FELConstants.js';
import PickupCoil from '../model/PickupCoil.js';

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

    const maxEMFProperty = new NumberProperty( 0 );
    pickupCoil.emfProperty.link( emf => {
      if ( emf > maxEMFProperty.value ) {
        maxEMFProperty.value = emf;
      }
    } );

    // If pickupCoil.maxEMFProperty is changed via Developer controls, reset the display in this panel.
    // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/66#issuecomment-2207402239
    pickupCoil.maxEMFProperty.link( () => maxEMFProperty.reset() );

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
          new Text( `${PHI} =`, LABEL_TEXT_OPTIONS ),
          new Text( `${DELTA_PHI} =`, LABEL_TEXT_OPTIONS ),
          new Text( 'EMF =', LABEL_TEXT_OPTIONS ),
          new Text( 'Max EMF =', LABEL_TEXT_OPTIONS )
        ],

        // Values
        [
          new Text( fluxStringProperty, VALUE_TEXT_OPTIONS ),
          new Text( deltaFluxStringProperty, VALUE_TEXT_OPTIONS ),
          new Text( emfStringProperty, VALUE_TEXT_OPTIONS ),
          new Text( maxEMFStringProperty, VALUE_TEXT_OPTIONS )
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