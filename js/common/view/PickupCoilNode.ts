// Copyright 2023-2025, University of Colorado Boulder

/**
 * PickupCoilGraphic is the visual representation of a pickup coil, with indicators (light bulb and voltmeter)
 * for displaying the effect of electromagnetic induction. The origin is at the center of the coil.
 *
 * This is based on PickupCoilGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PickupCoil from '../model/PickupCoil.js';
import CoilNode from './CoilNode.js';
import FELLightBulbNode from './FELLightBulbNode.js';
import FELMovableNode, { FELMovableNodeOptions } from './FELMovableNode.js';
import PickupCoilAreaNode from './PickupCoilAreaNode.js';
import PickupCoilSamplePointsNode from './PickupCoilSamplePointsNode.js';
import VoltmeterNode from './VoltmeterNode.js';

type SelfOptions = {
  maxRayLength?: number; // passed to LightBulbNode
  lockToAxisProperty?: TReadOnlyProperty<boolean>;
};

type PickupCoilNodeOptions = SelfOptions &
  PickOptional<FELMovableNodeOptions, 'isMovable' | 'dragBoundsProperty'> &
  PickRequired<FELMovableNodeOptions, 'tandem'>;

export default class PickupCoilNode extends FELMovableNode {

  public readonly backgroundNode: Node; // See CoilNode backgroundNode

  public constructor( pickupCoil: PickupCoil, providedOptions: PickupCoilNodeOptions ) {

    const options = optionize<PickupCoilNodeOptions, StrictOmit<SelfOptions, 'lockToAxisProperty'>, NodeOptions>()( {

      // SelfOptions
      maxRayLength: 350
    }, providedOptions );

    const coilNode = new CoilNode( pickupCoil.coil, pickupCoil.positionProperty, {
      dragBoundsProperty: options.dragBoundsProperty,
      isMovable: options.isMovable,
      tandem: options.tandem.createTandem( 'coilNode' )
    } );

    const lightBulbNode = new FELLightBulbNode( pickupCoil.lightBulb, pickupCoil.currentIndicatorProperty, {
      maxRayLength: options.maxRayLength,
      tandem: options.tandem.createTandem( 'lightBulbNode' )
    } );

    const voltmeterNode = new VoltmeterNode( pickupCoil.voltmeter, pickupCoil.currentIndicatorProperty,
      coilNode.boundsProperty, options.tandem.createTandem( 'voltmeterNode' ) );

    // Dynamically position the light bulb and voltmeter when the size of the coil changes.
    coilNode.boundsProperty.link( () => {

      // x offset from the coil's origin, to account for 3D perspective. Set this by choosing voltmeter and 1 loop,
      // then verifying that the voltmeter's resistor appears to be centered on the top wire.
      const xOffset = -6;

      // Position the light bulb using x,y because there may be light rays present.
      lightBulbNode.x = coilNode.x + xOffset;
      lightBulbNode.y = coilNode.top + pickupCoil.coil.wireWidth + 2; // cover the coil's rounded ends

      // Position the voltmeter.
      voltmeterNode.centerX = coilNode.x + xOffset;
      voltmeterNode.bottom = coilNode.top + pickupCoil.coil.wireWidth - 2; // cover the coil's rounded ends
    } );

    // This Node's children are the foreground elements only.
    options.children = [ coilNode, lightBulbNode, voltmeterNode ];

    // Render the area model and sample points for the coil.
    if ( phet.chipper.queryParameters.dev ) {
      const areaNode = new PickupCoilAreaNode( pickupCoil );
      const samplePointsNode = new PickupCoilSamplePointsNode( pickupCoil );
      options.children.push( areaNode, samplePointsNode );
    }

    super( pickupCoil.positionProperty, options );

    this.addLinkedElement( pickupCoil );

    this.backgroundNode = coilNode.backgroundNode;

    // Because backgroundNode is added to the scene graph elsewhere, ensure that its visibility remains synchronized with this Node.
    this.visibleProperty.link( visible => {
      this.backgroundNode.visible = visible;
    } );

    // Because backgroundNode is added to the scene graph elsewhere, ensure that it is draggable only if this Node is draggable.
    this.inputEnabledProperty.link( inputEnabled => {
      this.backgroundNode.inputEnabledProperty.value = inputEnabled;
    } );

    // Superclass FELMovableNode handles positioning this Node. But because backgroundNode is added to the scene graph
    // elsewhere, we also need to handle positioning of backgroundNode.
    pickupCoil.positionProperty.link( position => {
      this.backgroundNode.translation = position;
    } );

    // Use the same highlights for the foreground and background.
    // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/176.
    Multilink.multilink( [ coilNode.localBoundsProperty, coilNode.backgroundNode.localBoundsProperty ],
      ( foregroundBounds, backgroundBounds ) => {
        const highlightRectangle = Shape.bounds( foregroundBounds.union( backgroundBounds ) );
        this.focusHighlight = highlightRectangle;
        coilNode.backgroundNode.focusHighlight = highlightRectangle;
      } );

    // Change the cursor to indicate whether dragging is constrained to the x-axis.
    options.lockToAxisProperty && options.lockToAxisProperty.link( lockToAxis => {
      const cursor = lockToAxis ? 'ew-resize' : 'pointer';
      this.cursor = cursor;
      this.backgroundNode.cursor = cursor;
    } );
  }
}

faradaysElectromagneticLab.register( 'PickupCoilNode', PickupCoilNode );