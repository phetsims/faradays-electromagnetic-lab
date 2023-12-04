// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import lightBulbIcon_png from '../../../images/lightBulbIcon_png.js';

export default class LightBulbNode extends Node {

  //TODO replace image file with code-generated icon
  public static createIcon( scale = 1 ): Node {
    return new Image( lightBulbIcon_png, {
      scale: scale
    } );
  }
}

faradaysElectromagneticLab.register( 'LightBulbNode', LightBulbNode );