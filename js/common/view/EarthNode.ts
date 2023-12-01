// Copyright 2023, University of Colorado Boulder

//TODO Replace earth_png with something less Americas-centric?

/**
 * EarthNode is the view of a planet earth, which aligns itself with the position and rotation of a BarMagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { DragListener, Image, Node, NodeOptions, Path, SpritesOptions } from '../../../../scenery/js/imports.js';
import BarMagnet from '../model/BarMagnet.js';
import earth_png from '../../../images/earth_png.js';
import { Shape } from '../../../../kite/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

type EarthNodeOptions = SelfOptions & PickRequired<SpritesOptions, 'visibleProperty' | 'tandem'>;

export default class EarthNode extends Node {

  public constructor( barMagnet: BarMagnet, providedOptions: EarthNodeOptions ) {

    const earthImage = new Image( earth_png, {
      scale: 0.6,
      opacity: 0.75,
      rotation: Math.PI / 2, // earth_png has north up, bar magnet has north to the right
      pickable: false // ... so earthPath determines where this Node can be grabbed.
    } );

    // ... so this Node can only be grabbed by the circular shape that matches earthImage.
    const earthPath = new Path( Shape.circle( earthImage.width / 2 ), {
      fill: 'transparent',
      center: earthImage.center
    } );

    const options = optionize<EarthNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ earthPath, earthImage ],
      cursor: 'pointer'
    }, providedOptions );

    super( options );

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

    // KeyboardDragListener is unnecessary for EarthNode, since BarMagnetNode has a KeyboardDragListener.
  }
}

faradaysElectromagneticLab.register( 'EarthNode', EarthNode );