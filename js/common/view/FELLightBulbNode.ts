// Copyright 2023, University of Colorado Boulder

/**
 * FELLightBulbNode is the visualization of the light bulb, used as an indicator of current in the pickup coil.
 * The origin is at the center bottom of the base.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import LightBulb from '../model/LightBulb.js';
import LightBulbNode from '../../../../scenery-phet/js/LightBulbNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { CurrentIndicator } from '../model/CurrentIndicator.js';
import lightBulbOff_png from '../../../../scenery-phet/mipmaps/lightBulbOff_png.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import FELColors from '../FELColors.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class FELLightBulbNode extends Node {

  public constructor( lightBulb: LightBulb, currentIndicatorProperty: TReadOnlyProperty<CurrentIndicator>, tandem: Tandem ) {

    const baseNode = new ShadedRectangle( new Bounds2( 0, 0, 150, 20 ), {
      baseColor: FELColors.lightBulbBaseColorProperty,
      cornerRadius: 5,
      centerBottom: Vector2.ZERO // origin at center bottom of the base
    } );

    const socketNode = new ShadedRectangle( new Bounds2( 0, 0, 38, 20 ), {
      baseColor: FELColors.lightBulbSocketColorProperty,
      cornerRadius: 5,
      centerX: baseNode.centerX,
      bottom: baseNode.top + 14 // overlap enough to hide the bottom rounded corners
    } );

    const bulbNode = new LightBulbNode( lightBulb.brightnessProperty, {
      bulbImageScale: 0.45,

      // From the Java version, see LightRaysGraphic.java
      lightRaysNodeOptions: {
        minRays: 8,
        maxRays: 60,
        minRayLength: 0,
        maxRayLength: 350,
        longRayLineWidth: 3,
        mediumRayLineWidth: 2,
        shortRayLineWidth: 1,
        stroke: FELColors.lightRaysColorProperty
      },
      centerX: socketNode.centerX,
      bottom: socketNode.top + 5 // overlap enough to make the bulb appear to be in the socket
    } );

    super( {
      children: [ bulbNode, socketNode, baseNode ],
      visibleProperty: new DerivedProperty( [ currentIndicatorProperty ], indicator => ( indicator === 'lightBulb' ), {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      tandem: tandem
    } );

    this.addLinkedElement( lightBulb );
  }

  /**
   * Creates an icon for the light bulb, used to label controls.
   */
  public static createIcon( scale = 0.2 ): Node {
    return new Image( lightBulbOff_png, {
      scale: scale,
      pickable: false
    } );
  }
}

faradaysElectromagneticLab.register( 'FELLightBulbNode', FELLightBulbNode );