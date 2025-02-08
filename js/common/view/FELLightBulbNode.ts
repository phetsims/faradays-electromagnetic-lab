// Copyright 2023-2025, University of Colorado Boulder

/**
 * FELLightBulbNode is the visualization of the light bulb, used as an indicator of current in the pickup coil.
 * The origin is at the center bottom of the base.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import LightBulbNode from '../../../../scenery-phet/js/LightBulbNode.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import lightBulbOff_png from '../../../../scenery-phet/mipmaps/lightBulbOff_png.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELColors from '../FELColors.js';
import CurrentIndicator from '../model/CurrentIndicator.js';
import LightBulb from '../model/LightBulb.js';

type SelfOptions = {
  maxRayLength?: number; // passed to LightBulbNode
};

type FELLightBulbNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class FELLightBulbNode extends Node {

  public constructor( lightBulb: LightBulb,
                      currentIndicatorProperty: TReadOnlyProperty<CurrentIndicator>,
                      providedOptions: FELLightBulbNodeOptions ) {

    const options = optionize<FELLightBulbNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      maxRayLength: 350,

      // NodeOptions
      visibleProperty: new DerivedProperty( [ currentIndicatorProperty ], indicator => ( indicator === lightBulb ), {
        tandem: providedOptions.tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      // We do not want the user to drag the pickup coil by its light bulb.
      // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/189
      pickable: false,
      phetioFeatured: true
    }, providedOptions );

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
      bulbImageScale: 0.5,

      // From the Java version, see LightRaysGraphic.java
      lightRaysNodeOptions: {
        pickable: false,
        minRays: 20,
        maxRays: 20,
        minRayLength: 0,
        maxRayLength: options.maxRayLength,
        longRayLineWidth: 2,
        mediumRayLineWidth: 2,
        shortRayLineWidth: 1,
        stroke: FELColors.lightRaysColorProperty
      },
      centerX: socketNode.centerX,

      // Overlap enough to hide the bulb's base inside the socket, so we don't see the perspective problem
      // with LightBulbNode's default images. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/52.
      bottom: socketNode.top + 18
    } );

    options.children = [ bulbNode, socketNode, baseNode ];

    super( options );

    this.addLinkedElement( lightBulb );
  }

  /**
   * Creates an icon for the light bulb.
   */
  public static createIcon( scale = 0.2 ): Node {
    return new Image( lightBulbOff_png, {
      scale: scale,
      pickable: false
    } );
  }
}

faradaysElectromagneticLab.register( 'FELLightBulbNode', FELLightBulbNode );