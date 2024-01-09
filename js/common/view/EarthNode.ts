// Copyright 2023-2024, University of Colorado Boulder

/**
 * EarthNode is the view of planet earth, which aligns itself the poles of a bar magnet.
 * Origin is at the center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Image, Path } from '../../../../scenery/js/imports.js';
import BarMagnet from '../model/BarMagnet.js';
import { Shape } from '../../../../kite/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import FELMovableNode, { FELMovableNodeOptions } from './FELMovableNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import earthAmericas_png from '../../../images/earthAmericas_png.js';
import FELPreferences from '../model/FELPreferences.js';
import earthAfrica_png from '../../../images/earthAfrica_png.js';

type SelfOptions = EmptySelfOptions;

type EarthNodeOptions = SelfOptions & PickRequired<FELMovableNode, 'visibleProperty' | 'tandem'>;

export default class EarthNode extends FELMovableNode {

  public constructor( barMagnet: BarMagnet, providedOptions: EarthNodeOptions ) {

    const earthImage = new Image( earthAmericas_png, {
      scale: 0.6,
      opacity: 0.75,
      rotation: Math.PI / 2, // earth_png has north up, bar magnet has north to the right
      pickable: false, // ... so earthPath determines where this Node can be grabbed.
      center: Vector2.ZERO
    } );

    FELPreferences.earthImageProperty.link( earthView => {
      if ( earthView === 'Africa' ) {
        earthImage.image = earthAfrica_png;
      }
      else {
        earthImage.image = earthAmericas_png;
      }
    } );

    // ... so this Node can only be grabbed by the circular shape that matches earthImage.
    const earthPath = new Path( Shape.circle( earthImage.width / 2 ), {
      fill: 'transparent',
      center: earthImage.center
    } );

    const options = optionize<EarthNodeOptions, SelfOptions, FELMovableNodeOptions>()( {
      hasKeyboardDragListener: false, // unnecessary for EarthNode, since BarMagnetNode has a KeyboardDragListener.
      children: [ earthPath, earthImage ]
    }, providedOptions );

    super( barMagnet, options );

    barMagnet.rotationProperty.link( rotation => {
      this.rotateAround( this.center, rotation - this.rotation );
    } );
  }
}

faradaysElectromagneticLab.register( 'EarthNode', EarthNode );