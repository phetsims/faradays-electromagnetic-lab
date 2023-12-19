// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import LightBulb from '../model/LightBulb.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LightBulbNode from '../../../../scenery-phet/js/LightBulbNode.js';
import lightBulbIcon_png from '../../../images/lightBulbIcon_png.js';

export default class FELLightBulbNode extends Node {

  public constructor( lightBulb: LightBulb, tandem: Tandem ) {

    const lightBulbNode = new LightBulbNode( lightBulb.brightnessProperty );

    //TODO add bulb base

    super( {
      children: [ lightBulbNode ],
      tandem: tandem
    } );
  }

  public static createIcon( scale = 1 ): Node {
    return new Image( lightBulbIcon_png, {
      scale: scale
    } );
  }
}

faradaysElectromagneticLab.register( 'FELLightBulbNode', FELLightBulbNode );