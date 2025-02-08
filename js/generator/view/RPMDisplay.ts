// Copyright 2023-2025, University of Colorado Boulder

/**
 * RPMDisplay is the display of RPM (rotations per minute) that appears on the turbine.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import FELColors from '../../common/FELColors.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';

type SelfOptions = {
  radius?: number;
  outerRingWidth?: number;
};

type RPMDisplayOptions = SelfOptions & NodeTranslationOptions;

export default class RPMDisplay extends Node {

  public constructor( rpmProperty: TReadOnlyProperty<number>, providedOptions: RPMDisplayOptions ) {

    const options = optionize<RPMDisplayOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      radius: 10,
      outerRingWidth: 6
    }, providedOptions );

    const circle = new Circle( {
      radius: options.radius,
      lineWidth: options.outerRingWidth,
      stroke: FELColors.rpmDisplayRingColorProperty,
      fill: FELColors.rpmDisplayCenterColorProperty
    } );

    const rpmValueStringProperty = new DerivedStringProperty( [ rpmProperty ], rpm => `${Utils.toFixed( rpm, 1 )}` );

    // RPM value in a larger font
    const rpmValueText = new Text( rpmValueStringProperty, {
      font: new PhetFont( 18 ),
      fill: FELColors.rpmDisplayTextColorProperty
    } );

    // 'RPM' units in a smaller font
    const rpmUnitsText = new Text( FaradaysElectromagneticLabStrings.units.RPMStringProperty, {
      font: new PhetFont( 10 ),
      fill: FELColors.rpmDisplayTextColorProperty,
      maxWidth: 24
    } );

    const rpmVBox = new VBox( {
      children: [ rpmValueText, rpmUnitsText ],
      spacing: 2,
      align: 'center'
    } );
    rpmVBox.boundsProperty.link( () => {
      rpmVBox.center = circle.center;
    } );

    options.children = [ circle, rpmVBox ];

    super( options );
  }
}

faradaysElectromagneticLab.register( 'RPMDisplay', RPMDisplay );