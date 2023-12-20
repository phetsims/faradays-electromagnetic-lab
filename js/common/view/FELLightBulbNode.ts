// Copyright 2023, University of Colorado Boulder

/**
 * FELLightBulbNode is the visualization of the light bulb, used as an indicator of current in the pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import LightBulb from '../model/LightBulb.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LightBulbNode from '../../../../scenery-phet/js/LightBulbNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { Indicator } from '../model/Indicator.js';
import lightBulbOff_png from '../../../../scenery-phet/mipmaps/lightBulbOff_png.js';

export default class FELLightBulbNode extends Node {

  public constructor( lightBulb: LightBulb, indicatorProperty: TReadOnlyProperty<Indicator>, tandem: Tandem ) {

    const lightBulbNode = new LightBulbNode( lightBulb.brightnessProperty, {
      bulbImageScale: 0.45
    } );

    //TODO add bulb base

    super( {
      children: [ lightBulbNode ],
      visibleProperty: new DerivedProperty( [ indicatorProperty ], indicator => ( indicator === 'lightBulb' ) ),
      tandem: tandem
    } );
  }

  public static createIcon( scale = 0.2 ): Node {
    return new Image( lightBulbOff_png, {
      scale: scale
    } );
  }
}

faradaysElectromagneticLab.register( 'FELLightBulbNode', FELLightBulbNode );