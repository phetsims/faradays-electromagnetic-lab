// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import batteryIcon_png from '../../../images/batteryIcon_png.js';

export default class BatteryNode extends Node {

  //TODO replace image file with code-generated icon
  public static createIcon( scale = 1 ): Node {
    return new Image( batteryIcon_png, {
      scale: scale
    } );
  }
}

faradaysElectromagneticLab.register( 'BatteryNode', BatteryNode );