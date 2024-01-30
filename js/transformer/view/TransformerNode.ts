// Copyright 2024, University of Colorado Boulder

/**
 * TransformerNode is the view of the Transformer model element, which consists of an electromagnet and pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Node } from '../../../../scenery/js/imports.js';
import ElectromagnetNode from '../../common/view/ElectromagnetNode.js';
import PickupCoilNode from '../../common/view/PickupCoilNode.js';
import Transformer from '../model/Transformer.js';
import Emitter from '../../../../axon/js/Emitter.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class TransformerNode extends Node {

  public readonly electromagnetNode: ElectromagnetNode;
  public readonly pickupCoilNode: PickupCoilNode;

  public constructor( transformer: Transformer, stepEmitter: Emitter<[ number ]>,
                      dragBoundsProperty: TReadOnlyProperty<Bounds2>,
                      tandem: Tandem ) {

    const electromagnetNode = new ElectromagnetNode( transformer.electromagnet, {
      dragBoundsProperty: dragBoundsProperty,
      tandem: tandem.createTandem( 'electromagnetNode' )
    } );

    const pickupCoilNode = new PickupCoilNode( transformer.pickupCoil, {
      dragBoundsProperty: dragBoundsProperty,
      tandem: tandem.createTandem( 'pickupCoilNode' )
    } );

    super( {
      children: [ electromagnetNode, pickupCoilNode ],
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    } );

    this.electromagnetNode = electromagnetNode;
    this.pickupCoilNode = pickupCoilNode;

    this.addLinkedElement( transformer );
  }

  public step( dt: number ): void {
    this.electromagnetNode.step( dt );
    this.pickupCoilNode.step( dt );
  }
}

faradaysElectromagneticLab.register( 'TransformerNode', TransformerNode );