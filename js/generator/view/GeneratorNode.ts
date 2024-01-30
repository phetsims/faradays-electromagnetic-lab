// Copyright 2024, University of Colorado Boulder

/**
 * GeneratorNode is the view of the Generator model element, which includes a turbine and pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../scenery/js/imports.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Generator from '../model/Generator.js';
import TurbineNode from './TurbineNode.js';
import PickupCoilNode from '../../common/view/PickupCoilNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

export default class GeneratorNode extends Node {

  private readonly pickupCoilNode: PickupCoilNode;

  // Must be added to the scene graph separately. See CoilNode backgroundNode.
  public readonly backgroundNode: Node;

  public constructor( generator: Generator, layoutBounds: Bounds2,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>, tandem: Tandem ) {

    const turbineNode = new TurbineNode( generator.turbine, layoutBounds, visibleBoundsProperty,
      tandem.createTandem( 'turbineNode' ) );

    const pickupCoilNode = new PickupCoilNode( generator.pickupCoil, {
      isMovable: false, // pickupCoilNode is not movable in this screen.
      tandem: tandem.createTandem( 'pickupCoilNode' )
    } );

    super( {
      children: [ turbineNode, pickupCoilNode ],
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    } );

    this.pickupCoilNode = pickupCoilNode;
    this.backgroundNode = pickupCoilNode.backgroundNode;

    this.addLinkedElement( generator );
  }

  public step( dt: number ): void {
    this.pickupCoilNode.step( dt );
  }
}

faradaysElectromagneticLab.register( 'GeneratorNode', GeneratorNode );