// Copyright 2024-2025, University of Colorado Boulder

/**
 * PowerSupplyPanel is the base class for ACPowerSupplyPanel and DCPowerSupplyPanel.  It makes the panel draggable,
 * constrained to some drag bounds.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELConstants from '../FELConstants.js';
import CurrentSource from '../model/CurrentSource.js';

type SelfOptions = {
  position: Vector2; // initial position of the panel's top-left corner
};

export type PowerSupplyPanelOptions = SelfOptions &
  PickRequired<PanelOptions, 'fill' | 'stroke' | 'tandem'>;

export default class PowerSupplyPanel extends InteractiveHighlighting( Panel ) {

  // Position of the panel's top-left corner.
  private readonly positionProperty: Property<Vector2>;

  public constructor( content: Node,
                      powerSupply: CurrentSource,
                      currentSourceProperty: TReadOnlyProperty<CurrentSource>,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      rightPanelsBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions: PowerSupplyPanelOptions ) {

    const visibleProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'visibleProperty' ),
      phetioDocumentation: 'Set this to false to permanently hide this panel. ' +
                           'Otherwise, visibility depends on which Current Source is selected.',
      phetioFeatured: true
    } );

    const options = optionize4<PowerSupplyPanelOptions, SelfOptions, PanelOptions>()( {}, FELConstants.PANEL_OPTIONS, {
      visibleProperty: new DerivedProperty( [ currentSourceProperty, visibleProperty ],
        ( currentSource, visible ) => ( currentSource === powerSupply ) && visible ),
      xMargin: 10,
      yMargin: 5,
      cursor: 'pointer',
      tagName: 'div', // for KeyboardDragListener
      focusable: true, // for KeyboardDragListener
      groupFocusHighlight: true,
      phetioFeatured: true
    }, providedOptions );

    super( content, options );

    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.positionProperty.link( position => {
      this.translation = position;
    } );

    this.addLinkedElement( powerSupply );

    // Keep the entire panel inside drag bounds.
    const dragBoundsProperty = new DerivedProperty(
      [ visibleBoundsProperty, rightPanelsBoundsProperty, content.boundsProperty ],
      ( visibleBounds, rightPanelsBounds, contentBounds ) => {
        const panelWidth = contentBounds.width + 2 * options.xMargin;
        const panelHeight = contentBounds.height + 2 * options.yMargin;
        return new Bounds2(
          visibleBounds.minX + FELConstants.SCREEN_VIEW_X_MARGIN,
          visibleBounds.minY + FELConstants.SCREEN_VIEW_Y_MARGIN,
          rightPanelsBounds.minX - panelWidth - FELConstants.SCREEN_VIEW_X_MARGIN,
          visibleBounds.maxY - panelHeight - FELConstants.SCREEN_VIEW_Y_MARGIN );
      }, {
        valueComparisonStrategy: 'equalsFunction'
      } );

    // Keep the position inside of drag bounds.
    dragBoundsProperty.lazyLink( dragBounds => {
      if ( !isSettingPhetioStateProperty.value ) {
        if ( !dragBounds.containsPoint( this.positionProperty.value ) ) {
          this.positionProperty.value = dragBounds.closestBoundaryPointTo( this.positionProperty.value );
        }
      }
    } );

    const dragListener = new SoundDragListener( {
      positionProperty: this.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      useParentOffset: true,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new SoundKeyboardDragListener( {
      positionProperty: this.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      dragSpeed: 600, // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/163#issuecomment-2136265629
      shiftDragSpeed: 150,
      tandem: options.tandem.createTandem( 'keyboardDragListener' )
    } );
    this.addInputListener( keyboardDragListener );
  }

  public reset(): void {
    this.positionProperty.reset();
  }
}


faradaysElectromagneticLab.register( 'PowerSupplyPanel', PowerSupplyPanel );