// Copyright 2024, University of Colorado Boulder

/**
 * PowerSupplyPanel is the base class for ACPowerSupplyPanel and DCPowerSupplyPanel.  It makes the panel draggable,
 * constrained to some drag bounds.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CurrentSource from '../model/CurrentSource.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Node } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Property from '../../../../axon/js/Property.js';
import RichDragListener from '../../../../scenery-phet/js/RichDragListener.js';
import RichKeyboardDragListener from '../../../../scenery-phet/js/RichKeyboardDragListener.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';

type SelfOptions = {
  position: Vector2; // initial position of the panel's top-left corner
  dragBoundsProperty: TReadOnlyProperty<Bounds2>;
};

export type PowerSupplyPanelOptions = SelfOptions &
  PickRequired<PanelOptions, 'fill' | 'stroke' | 'tandem'>;

export default class PowerSupplyPanel extends Panel {

  // Position of the panel's top-left corner.
  private readonly positionProperty: Property<Vector2>;

  public constructor( content: Node, powerSupply: CurrentSource, currentSourceProperty: TReadOnlyProperty<CurrentSource>,
                      providedOptions: PowerSupplyPanelOptions ) {

    const options = optionize4<PowerSupplyPanelOptions, SelfOptions, PanelOptions>()( {}, FELConstants.PANEL_OPTIONS, {

      //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/163 Does PhET-iO client need a mutable visibleProperty?
      visibleProperty: new DerivedProperty( [ currentSourceProperty ], currentSource => ( currentSource === powerSupply ) ),
      xMargin: 10,
      yMargin: 5,
      cursor: 'pointer',
      tagName: 'div', // for KeyboardDragListener
      focusable: true, // for KeyboardDragListener
      groupFocusHighlight: true, //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/163 slider and drag are both affected
      phetioFeatured: true
    }, providedOptions );

    super( content, options );

    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.positionProperty.link( position => {
      this.translation = position;
    } );

    // Interrupt interaction when this Node becomes invisible.
    this.visibleProperty.lazyLink( visible => !visible && this.interruptSubtreeInput() );

    this.addLinkedElement( powerSupply );

    const dragListener = new RichDragListener( {
      positionProperty: this.positionProperty,
      dragBoundsProperty: options.dragBoundsProperty,
      useParentOffset: true,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new RichKeyboardDragListener( {
      positionProperty: this.positionProperty,
      dragBoundsProperty: options.dragBoundsProperty,
      tandem: options.tandem.createTandem( 'keyboardDragListener' )
    } );
    this.addInputListener( keyboardDragListener );

    // Keep the position inside of drag bounds.
    options.dragBoundsProperty.lazyLink( dragBounds => {
      if ( !isSettingPhetioStateProperty.value ) {
        if ( !dragBounds.containsPoint( this.positionProperty.value ) ) {
          this.positionProperty.value = dragBounds.closestBoundaryPointTo( this.positionProperty.value );
        }
      }
    } );
  }

  public reset(): void {
    this.positionProperty.reset();
  }
}


faradaysElectromagneticLab.register( 'PowerSupplyPanel', PowerSupplyPanel );