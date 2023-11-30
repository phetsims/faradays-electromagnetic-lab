// Copyright 2023, University of Colorado Boulder

//TODO dragBounds
//TODO collision detection
//TODO color profile
//TODO translation of 'N' and 'S'
//TODO eliminate barMagnet_png

/**
 * BarMagnetNode is the view of a bar magnet, with optional visualization of the field inside the magnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnet from '../model/BarMagnet.js';
import { DragListener, GridBox, Image, KeyboardDragListener, KeyboardDragListenerOptions, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import barMagnet_png from '../../../images/barMagnet_png.js';
import FELConstants from '../FELConstants.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import CompassNeedleNode from './CompassNeedleNode.js';

const FIELD_INSIDE_ROWS = 2;
const FIELD_INSIDE_COLUMNS = 7;
const FIELD_INSIDE_X_SPACING = 10;
const FIELD_INSIDE_Y_SPACING = 12;

type SelfOptions = {
  seeInsideProperty?: TReadOnlyProperty<boolean> | null;
};

type BarMagnetNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class BarMagnetNode extends Node {

  public constructor( barMagnet: BarMagnet, providedOptions: BarMagnetNodeOptions ) {

    const options = optionize<BarMagnetNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      seeInsideProperty: null,

      // NodeOptions
      cursor: 'pointer',
      tagName: 'div', // for KeyboardDragListener
      focusable: true, // for KeyboardDragListener
      phetioFeatured: true
    }, providedOptions );

    const barMagnetImage = new Image( barMagnet_png );
    assert && assert( barMagnetImage.width === barMagnet.size.width ); //TODO
    assert && assert( barMagnetImage.height === barMagnet.size.height ); //TODO

    options.children = [ barMagnetImage ];

    super( options );

    this.addLinkedElement( barMagnet );

    barMagnet.positionProperty.link( position => {
      this.center = position;
    } );

    barMagnet.rotationProperty.link( rotation => {
      this.rotateAround( this.center, rotation - this.rotation );
    } );

    const dragListener = new DragListener( {
      positionProperty: barMagnet.positionProperty,
      useParentOffset: true,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener(
      combineOptions<KeyboardDragListenerOptions>( {}, FELConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
        positionProperty: barMagnet.positionProperty,
        tandem: options.tandem.createTandem( 'keyboardDragListener' )
      } ) );
    this.addInputListener( keyboardDragListener );

    // If a seeInsideProperty is provided, then add the visualization of the field inside the bar magnet.
    // This is a grid of compass needles inside the bounds of the bar magnet. Alpha is modulated as the
    // strength of the magnet changes.
    if ( options.seeInsideProperty ) {

      const fieldInsideNode = new GridBox( {
        children: _.times( FIELD_INSIDE_ROWS * FIELD_INSIDE_COLUMNS, () => new CompassNeedleNode() ),
        autoRows: FIELD_INSIDE_ROWS,
        xSpacing: FIELD_INSIDE_X_SPACING,
        ySpacing: FIELD_INSIDE_Y_SPACING,
        visibleProperty: options.seeInsideProperty,
        center: barMagnetImage.center
      } );
      this.addChild( fieldInsideNode );

      // Modulate opacity to as magnet strength changes.
      barMagnet.strengthProperty.link( strength => {
        fieldInsideNode.opacity = strength / barMagnet.strengthProperty.rangeProperty.value.max;
      } );
    }
  }
}

faradaysElectromagneticLab.register( 'BarMagnetNode', BarMagnetNode );