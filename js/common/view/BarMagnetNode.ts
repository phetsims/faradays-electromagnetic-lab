// Copyright 2023, University of Colorado Boulder

//TODO color profile
//TODO translation of 'N' and 'S'
//TODO eliminate barMagnet_png

/**
 * BarMagnetNode is the view of a bar magnet, with optional visualization of the field inside the magnet.
 * The origin is at the center of the bar magnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnet from '../model/BarMagnet.js';
import { Image } from '../../../../scenery/js/imports.js';
import barMagnet_png from '../../../images/barMagnet_png.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import FieldInsideNode from './FieldInsideNode.js';
import FELMovableNode, { FELMovableNodeOptions } from './FELMovableNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SelfOptions = {
  seeInsideProperty?: TReadOnlyProperty<boolean>;
};

type BarMagnetNodeOptions = SelfOptions & StrictOmit<FELMovableNodeOptions, 'children'>;

export default class BarMagnetNode extends FELMovableNode {

  public constructor( barMagnet: BarMagnet, providedOptions: BarMagnetNodeOptions ) {

    const barMagnetImage = new Image( barMagnet_png, {
      center: Vector2.ZERO
    } );
    assert && assert( barMagnetImage.width === barMagnet.size.width );
    assert && assert( barMagnetImage.height === barMagnet.size.height );

    const options = optionize<BarMagnetNodeOptions, StrictOmit<SelfOptions, 'seeInsideProperty'>, FELMovableNodeOptions>()( {

      // FELMovableNodeOptions
      children: [ barMagnetImage ]
    }, providedOptions );

    super( barMagnet, options );

    this.addLinkedElement( barMagnet );

    barMagnet.rotationProperty.link( rotation => {
      this.rotateAround( this.center, rotation - this.rotation );
    } );

    // If seeInsideProperty was provided, then add the visualization of the field inside the bar magnet.
    if ( options.seeInsideProperty ) {
      this.addChild( new FieldInsideNode( barMagnet.strengthProperty, {
        visibleProperty: options.seeInsideProperty,
        center: barMagnetImage.center,
        tandem: options.tandem.createTandem( 'fieldInsideNode' )
      } ) );
    }
  }
}

faradaysElectromagneticLab.register( 'BarMagnetNode', BarMagnetNode );