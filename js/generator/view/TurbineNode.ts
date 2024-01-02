// Copyright 2023, University of Colorado Boulder

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

    const waterWheelNode = new WaterWheelNode( turbine, tandem.createTandem( 'waterWheelNode' ) );

    const barMagnetNode = new BarMagnetNode( turbine, {
      tandem: tandem.createTandem( 'barMagnetNode' ),
      phetioInputEnabledPropertyInstrumented: false
    } );

    const rpmDisplay = new RPMDisplay( turbine.rpmProperty, {
      radius: 0.6 * barMagnetNode.height,
      center: waterWheelNode.center
      // No PhET-iO instrumentation. There is nothing interesting here.
    } );

    const faucetNode = new WaterFaucetNode( turbine.speedProperty, {
      right: layoutBounds.left + 225,
      top: layoutBounds.top + 50,
      tandem: tandem.createTandem( 'faucetNode' )
    } );

    const waterNode = new WaterNode( turbine.speedProperty, turbine.speedProperty.range.max, visibleBoundsProperty, {
      centerX: faucetNode.x,
      top: faucetNode.y - 2
    } );

    super( {
      children: [ waterWheelNode, barMagnetNode, rpmDisplay, waterNode, faucetNode ],
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'TurbineNode', TurbineNode );