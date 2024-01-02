// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnetNode is the view of a bar magnet, with optional visualization of the field inside the magnet.
 * The origin is at the center of the bar magnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnet from '../model/BarMagnet.js';
import { Node, Text, TextOptions } from '../../../../scenery/js/imports.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
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
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';

const CORNER_RADIUS = 10;
const FONT = new PhetFont( { size: 30, weight: 'bold' } );

type SelfOptions = {
  seeInsideProperty?: TReadOnlyProperty<boolean>;
};

type BarMagnetNodeOptions = SelfOptions & Pick<FELMovableNodeOptions, 'tandem' | 'isMovable'>;

export default class BarMagnetNode extends FELMovableNode {

  public constructor( barMagnet: BarMagnet, providedOptions: BarMagnetNodeOptions ) {

    // The bar, with north and south sections
    const barNode = new BarNode( barMagnet.size );

    // 'N' and 'S' labels for the poles of the magnet
    const textOptions = {
      font: FONT,
      maxWidth: 0.25 * barMagnet.size.width,
      maxHeight: 0.85 * barMagnet.size.height
    };

    const northText = new Text( FaradaysElectromagneticLabStrings.symbol.NStringProperty,
      combineOptions<TextOptions>( {
        fill: FELColors.barMagnetNorthTextColorProperty
      }, textOptions ) );

    const southText = new Text( FaradaysElectromagneticLabStrings.symbol.SStringProperty,
      combineOptions<TextOptions>( {
        fill: FELColors.barMagnetSouthTextColorProperty
      }, textOptions ) );


    // Dynamically position the labels at the ends of the magnet.
    const textXMargin = 0.06 * barMagnet.size.width;

    northText.boundsProperty.link( () => {
      northText.right = barNode.right - textXMargin;
      northText.centerY = barNode.centerY;
    } );

    southText.boundsProperty.link( () => {
      southText.left = barNode.left + textXMargin;
      southText.centerY = barNode.centerY;
    } );

    const options = optionize<BarMagnetNodeOptions, StrictOmit<SelfOptions, 'seeInsideProperty'>, FELMovableNodeOptions>()( {

      // FELMovableNodeOptions
      children: [ barNode, northText, southText ]
    }, providedOptions );

    super( barMagnet, options );

    barMagnet.rotationProperty.link( rotation => {
      this.rotateAround( this.center, rotation - this.rotation );
    } );

    // If seeInsideProperty was provided, then add the visualization of the field inside the bar magnet.
    if ( options.seeInsideProperty ) {
      this.addChild( new FieldInsideNode( barMagnet, {
        visibleProperty: options.seeInsideProperty,
        center: barNode.center,
        tandem: options.tandem.createTandem( 'fieldInsideNode' )
      } ) );
    }
  }
}

//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/22 Decide what to do about lighting.
/**
 * BarNode is the bar for the bar magnet, with north and south sections.
 */
class BarNode extends Node {

  public constructor( size: Dimension2 ) {

    // The entire bar
    const northNode = new ShadedRectangle( new Bounds2( 0, 0, size.width, size.height ), {
      baseColor: FELColors.barMagnetNorthColorProperty,
      cornerRadius: CORNER_RADIUS
    } );

    // The entire bar clipped to the south section
    const southNode = new ShadedRectangle( new Bounds2( 0, 0, size.width, size.height ), {
      baseColor: FELColors.barMagnetSouthColorProperty,
      cornerRadius: CORNER_RADIUS,
      clipArea: Shape.roundedRectangleWithRadii( 0, 0, size.width / 2, size.height, {
        topLeft: CORNER_RADIUS,
        topRight: 0,
        bottomRight: 0,
        bottomLeft: CORNER_RADIUS
      } )
    } );

    super( {
      children: [ northNode, southNode ], // clipped section on top!
      center: Vector2.ZERO // origin at the center
    } );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetNode', BarMagnetNode );