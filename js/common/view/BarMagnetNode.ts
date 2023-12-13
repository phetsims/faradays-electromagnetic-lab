// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetNode is the view of a bar magnet, with optional visualization of the field inside the magnet.
 * The origin is at the center of the bar magnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnet from '../model/BarMagnet.js';
import { Text } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import FieldInsideNode from './FieldInsideNode.js';
import FELMovableNode, { FELMovableNodeOptions } from './FELMovableNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import FELColors from '../FELColors.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Shape } from '../../../../kite/js/imports.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

const CORNER_RADIUS = 10;
const FONT = new PhetFont( { size: 30, weight: 'bold' } );

type SelfOptions = {
  seeInsideProperty?: TReadOnlyProperty<boolean>;
};

type BarMagnetNodeOptions = SelfOptions & StrictOmit<FELMovableNodeOptions, 'children'>;

export default class BarMagnetNode extends FELMovableNode {

  public constructor( barMagnet: BarMagnet, providedOptions: BarMagnetNodeOptions ) {

    const southNode = new ShadedRectangle( new Bounds2( 0, 0, barMagnet.size.width, barMagnet.size.height ), {
      baseColor: FELColors.barMagnetSouthColorProperty,
      cornerRadius: CORNER_RADIUS,
      center: Vector2.ZERO
    } );

    const northNode = new ShadedRectangle( new Bounds2( 0, 0, barMagnet.size.width, barMagnet.size.height ), {
      baseColor: FELColors.barMagnetNorthColorProperty,
      right: southNode.right,
      centerY: southNode.centerY,
      clipArea: Shape.roundedRectangleWithRadii( barMagnet.size.width / 2, 0, barMagnet.size.width / 2, barMagnet.size.height, {
        topLeft: 0,
        topRight: CORNER_RADIUS,
        bottomRight: CORNER_RADIUS,
        bottomLeft: 0
      } )
    } );

    const xMargin = 0.06 * barMagnet.size.width;

    const southText = new Text( 'S', {
      font: FONT,
      fill: FELColors.barMagnetSouthTextColorProperty,
      left: southNode.left + xMargin,
      centerY: southNode.centerY
    } );

    const northText = new Text( 'N', {
      font: FONT,
      fill: FELColors.barMagnetNorthTextColorProperty,
      right: northNode.right - xMargin,
      centerY: northNode.centerY
    } );

    const options = optionize<BarMagnetNodeOptions, StrictOmit<SelfOptions, 'seeInsideProperty'>, FELMovableNodeOptions>()( {

      // FELMovableNodeOptions
      children: [ southNode, northNode, southText, northText ]
    }, providedOptions );

    super( barMagnet, options );

    barMagnet.rotationProperty.link( rotation => {
      this.rotateAround( this.center, rotation - this.rotation );
    } );

    // If seeInsideProperty was provided, then add the visualization of the field inside the bar magnet.
    if ( options.seeInsideProperty ) {
      this.addChild( new FieldInsideNode( barMagnet.strengthProperty, {
        visibleProperty: options.seeInsideProperty,
        center: southNode.center,
        tandem: options.tandem.createTandem( 'fieldInsideNode' )
      } ) );
    }
  }
}

faradaysElectromagneticLab.register( 'BarMagnetNode', BarMagnetNode );