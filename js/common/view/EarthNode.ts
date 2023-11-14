// Copyright 2023, University of Colorado Boulder

/**
 * EarthNode is the view of a planet earth, which aligns itself with the position and rotation of a BarMagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { DragListener, Image, Node } from '../../../../scenery/js/imports.js';
import BarMagnet from '../model/BarMagnet.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import earth_png from '../../../images/earth_png.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

export default class EarthNode extends Node {

  public constructor( barMagnet: BarMagnet, visibleProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) {

    const earthImage = new Image( earth_png, {
      scale: 0.6
    } );

    super( {
      children: [ earthImage ],
      visibleProperty: visibleProperty,
      cursor: 'pointer',
      tagName: 'div',
      focusable: true,
      tandem: tandem
    } );

    barMagnet.positionProperty.link( position => {
      this.center = position;
    } );

    barMagnet.rotationProperty.link( rotation => {
      this.rotateAround( this.center, rotation - this.rotation );
    } );

    //TODO Limit dragging to non-transparent pixels in the image.
    const dragListener = new DragListener( {
      positionProperty: barMagnet.positionProperty,
      useParentOffset: true,
      tandem: tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    // KeyboardDragListener is unnecessary for EarthNode, since BarMagnetNode has a KeyboardDragListener.
  }
}

faradaysElectromagneticLab.register( 'EarthNode', EarthNode );