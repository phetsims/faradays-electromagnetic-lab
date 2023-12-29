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
import HSlider from '../../../../sun/js/HSlider.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class BatteryNode extends Node {

  public constructor( battery: Battery, currentSourceProperty: TReadOnlyProperty<CurrentSource>, tandem: Tandem ) {

    //TODO Draw battery in code.
    const batteryImage = new Image( battery_png, {
      center: Vector2.ZERO
    } );

    const slider = new HSlider( battery.amplitudeProperty, battery.amplitudeProperty.range, {
      center: batteryImage.center
    } );

    super( {
      children: [ batteryImage, slider ],
      visibleProperty: new DerivedProperty( [ currentSourceProperty ], currentSource => ( currentSource === battery ), {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      tandem: tandem
    } );

    // Reflect the battery about the y-axis to change its polarity.
    battery.amplitudeProperty.link( amplitude => {
      batteryImage.matrix.setToIdentity();
      const xScale = ( amplitude >= 0 ) ? 1 : -1; // Sign of the amplitude determines the polarity of the battery.
      batteryImage.setScaleMagnitude( xScale, 1 );
      batteryImage.center = Vector2.ZERO;
    } );
  }

  public static createIcon( scale = 0.5 ): Node {
    return new Image( batteryDCell_png, {
      scale: scale
    } );
  }
}

faradaysElectromagneticLab.register( 'BatteryNode', BatteryNode );