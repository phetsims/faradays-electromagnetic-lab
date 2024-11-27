// Copyright 2023-2024, University of Colorado Boulder

/**
 * ElectromagnetNode is the view of an electromagnet. It consists of a source coil, DC battery, and AC power supply.
 * The origin is at the center of the coil.
 *
 * This is based on ElectromagnetGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Electromagnet from '../model/Electromagnet.js';
import ACPowerSupplyNode from './ACPowerSupplyNode.js';
import CoilNode from './CoilNode.js';
import DCPowerSupplyNode from './DCPowerSupplyNode.js';
import FELMovableNode, { FELMovableNodeOptions } from './FELMovableNode.js';

type SelfOptions = {
  lockToAxisProperty?: TReadOnlyProperty<boolean>;
};

type ElectromagnetNodeOptions = SelfOptions & PickRequired<FELMovableNodeOptions, 'tandem' | 'dragBoundsProperty'>;

export default class ElectromagnetNode extends FELMovableNode {

  public readonly backgroundNode: Node; // See CoilNode backgroundNode

  public constructor( electromagnet: Electromagnet, providedOptions: ElectromagnetNodeOptions ) {

    const options = optionize<ElectromagnetNodeOptions, StrictOmit<SelfOptions, 'lockToAxisProperty'>, FELMovableNodeOptions>()(
      {}, providedOptions );

    const coilNode = new CoilNode( electromagnet.coil, electromagnet.positionProperty, {
      dragBoundsProperty: options.dragBoundsProperty,
      tandem: options.tandem.createTandem( 'coilNode' )
    } );

    const dcPowerSupplyNode = new DCPowerSupplyNode( electromagnet.dcPowerSupply, {
      visibleProperty: new DerivedProperty( [ electromagnet.currentSourceProperty ],
        currentSource => ( currentSource === electromagnet.dcPowerSupply ) ),
      centerX: coilNode.centerX,
      bottom: coilNode.top + 5, // overlap end of coil
      tandem: options.tandem.createTandem( 'dcPowerSupplyNode' )
    } );

    const acPowerSupplyNode = new ACPowerSupplyNode( {
      visibleProperty: DerivedProperty.not( dcPowerSupplyNode.visibleProperty ),
      centerX: coilNode.centerX,
      bottom: dcPowerSupplyNode.bottom
    } );

    options.children = [ coilNode, dcPowerSupplyNode, acPowerSupplyNode ];

    // Render the shape used to determine whether a B-field position is inside or outside the electromagnet.
    if ( phet.chipper.queryParameters.dev ) {
      const magnetShapeNode = new Path( Shape.bounds( electromagnet.localBounds ), {
        visibleProperty: electromagnet.shapeVisibleProperty,
        stroke: 'yellow',
        pickable: false
      } );
      options.children.push( magnetShapeNode );
    }

    super( electromagnet.positionProperty, options );

    this.addLinkedElement( electromagnet );

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
    electromagnet.positionProperty.link( position => {
      this.backgroundNode.translation = position;
    } );

    // Use the same highlights for the foreground and background.
    // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/176.
    Multilink.multilink( [ this.localBoundsProperty ],
      bounds => {
        const highlightRectangle = Shape.bounds( bounds );
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

faradaysElectromagneticLab.register( 'ElectromagnetNode', ElectromagnetNode );