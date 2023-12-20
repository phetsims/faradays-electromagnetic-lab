// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import batteryDCell_png from '../../../../scenery-phet/images/batteryDCell_png.js';

export default class BatteryNode extends Node {

  public static createIcon( scale = 0.5 ): Node {
    return new Image( batteryDCell_png, {
      scale: scale
    } );
  }
}

faradaysElectromagneticLab.register( 'BatteryNode', BatteryNode );