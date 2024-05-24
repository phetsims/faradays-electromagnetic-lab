// Copyright 2023-2024, University of Colorado Boulder

/**
 * EarthNode is the view of planet earth, which aligns itself with the poles of a bar magnet.
 * Origin is at the center.
 *
 * This is based on EarthGraphic.java in the Java version of this sim.
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
import earthWesternHemisphere_svg from '../../../images/earthWesternHemisphere_svg.js';
import earthEasternHemisphere_svg from '../../../images/earthEasternHemisphere_svg.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { EarthHemisphere } from '../FELQueryParameters.js';

type SelfOptions = EmptySelfOptions;

type EarthNodeOptions = SelfOptions & PickRequired<FELMovableNodeOptions, 'tandem' | 'visibleProperty' | 'dragBoundsProperty'>;

export default class EarthNode extends FELMovableNode {

  public constructor( barMagnet: BarMagnet, earthHemisphereProperty: TReadOnlyProperty<EarthHemisphere>, providedOptions: EarthNodeOptions ) {

    const earthImageSourceProperty = new DerivedProperty( [ earthHemisphereProperty ], earthHemisphere => {
      return earthHemisphere === 'western' ? earthWesternHemisphere_svg : earthEasternHemisphere_svg;
    } );

    const earthImage = new Image( earthImageSourceProperty, {
      scale: 0.6,
      opacity: 0.6,
      rotation: -Math.PI / 2, // earth_png has north down, bar magnet has north to the right
      pickable: false, // ... so earthPath determines where this Node can be grabbed.
      center: Vector2.ZERO
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

    super( barMagnet.positionProperty, options );

    barMagnet.rotationProperty.link( rotation => {
      this.rotateAround( this.center, rotation - this.rotation );
    } );
  }
}

faradaysElectromagneticLab.register( 'EarthNode', EarthNode );