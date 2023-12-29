// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import batteryDCell_png from '../../../../scenery-phet/images/batteryDCell_png.js';
import Battery from '../model/Battery.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import battery_png from '../../../images/battery_png.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CurrentSource from '../model/CurrentSource.js';

export default class BatteryNode extends Node {

  public constructor( battery: Battery, currentSourceProperty: TReadOnlyProperty<CurrentSource>, tandem: Tandem ) {

    //TODO Draw battery in code.
    const batteryImage = new Image( battery_png );

    super( {
      children: [ batteryImage ],
      visibleProperty: new DerivedProperty( [ currentSourceProperty ], currentSource => ( currentSource === battery ), {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      tandem: tandem
    } );
  }

  public static createIcon( scale = 0.5 ): Node {
    return new Image( batteryDCell_png, {
      scale: scale
    } );
  }
}

faradaysElectromagneticLab.register( 'BatteryNode', BatteryNode );