// Copyright 2023-2024, University of Colorado Boulder

/**
 * TurbineNode is the view of a turbine generator. A bar magnet is attached to a water wheel, which turns when water
 * is dispensed from a faucet. This rotation modulates this magnetic field around the bar magnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Turbine from '../model/Turbine.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnetNode from '../../common/view/BarMagnetNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import RPMDisplay from './RPMDisplay.js';
import WaterNode from './WaterNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import WaterWheelNode from './WaterWheelNode.js';
import WaterFaucetNode from './WaterFaucetNode.js';

export default class TurbineNode extends Node {

  public constructor( turbine: Turbine, layoutBounds: Bounds2, visibleBoundsProperty: TReadOnlyProperty<Bounds2>, tandem: Tandem ) {

    const waterWheelNode = new WaterWheelNode( turbine.barMagnet );

    const barMagnetNode = new BarMagnetNode( turbine.barMagnet, {
      isMovable: false, // this bar magnet cannot be dragged
      tandem: tandem.createTandem( 'barMagnetNode' )
    } );

    const rpmDisplay = new RPMDisplay( turbine.rpmProperty, {
      radius: 0.6 * barMagnetNode.height,
      center: waterWheelNode.center
      // No PhET-iO instrumentation. There is nothing interesting here.
    } );

    const waterFaucetNode = new WaterFaucetNode( turbine.waterFaucet, {
      right: layoutBounds.left + 225,
      top: layoutBounds.top + 50,
      tandem: tandem.createTandem( 'waterFaucetNode' )
    } );

    const waterNode = new WaterNode( turbine.waterFaucet.flowRateProperty, turbine.waterFaucet.flowRateProperty.range.max,
      visibleBoundsProperty, {
        centerX: waterFaucetNode.x,
        top: waterFaucetNode.y - 2
      } );

    super( {
      children: [ waterWheelNode, barMagnetNode, rpmDisplay, waterNode, waterFaucetNode ],
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'TurbineNode', TurbineNode );