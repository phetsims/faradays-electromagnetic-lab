// Copyright 2024-2025, University of Colorado Boulder

/**
 * GeneratorNode is the view of the Generator model element, which includes a turbine and pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PickupCoilNode from '../../common/view/PickupCoilNode.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Generator from '../model/Generator.js';
import TurbineNode from './TurbineNode.js';

export default class GeneratorNode extends Node {

  public readonly backgroundNode: Node; // See CoilNode backgroundNode

  public constructor( generator: Generator, layoutBounds: Bounds2,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>, tandem: Tandem ) {

    const turbineNode = new TurbineNode( generator.turbine, layoutBounds, visibleBoundsProperty,
      tandem.createTandem( 'turbineNode' ) );

    const pickupCoilNode = new PickupCoilNode( generator.pickupCoil, {
      isMovable: false, // pickupCoilNode is not movable in this screen.
      maxRayLength: 500, // see https://github.com/phetsims/faradays-electromagnetic-lab/issues/66#issuecomment-2088698150
      tandem: tandem.createTandem( 'pickupCoilNode' )
    } );

    super( {
      children: [ turbineNode, pickupCoilNode ],
      tandem: tandem,
      phetioFeatured: true, // so that featured linked element will appear in 'Featured' tree
      phetioVisiblePropertyInstrumented: false
    } );

    this.backgroundNode = pickupCoilNode.backgroundNode;

    this.addLinkedElement( generator );
  }
}

faradaysElectromagneticLab.register( 'GeneratorNode', GeneratorNode );