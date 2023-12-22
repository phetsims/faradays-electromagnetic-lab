// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Circle, Node, NodeOptions, NodeTranslationOptions, RichText } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELColors from '../../common/FELColors.js';
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

    const rpmStringProperty = new DerivedStringProperty(
      [ rpmProperty, FaradaysElectromagneticLabStrings.units.RPMStringProperty ],
      ( rpm, RPMString ) => `${Utils.toFixed( rpm, 0 )}<br>${RPMString}` );

    const rpmText = new RichText( rpmStringProperty, {
      align: 'center',
      font: new PhetFont( 14 ),
      fill: FELColors.rpmDisplayTextColorProperty
      //TODO maxWidth
    } );
    rpmText.boundsProperty.link( () => {
      rpmText.center = circle.center;
    } );

    options.children = [ circle, rpmText ];

    super( options );
  }
}

faradaysElectromagneticLab.register( 'RPMDisplay', RPMDisplay );