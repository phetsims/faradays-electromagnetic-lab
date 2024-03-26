// Copyright 2023-2024, University of Colorado Boulder

/**
 * TurbineNode is the view of a turbine. A bar magnet is attached to a water wheel, which turns when water
 * is dispensed from a faucet. This rotation modulates the magnetic field around the bar magnet.
 *
 * This is based on TurbineGraphic.java in the Java version of this sim.
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

  /**
   * @param turbine
   * @param layoutBounds - for positioning the water faucet
   * @param visibleBoundsProperty - for making the water flow to the bottom of the browser window
   * @param tandem
   */
  public constructor( turbine: Turbine, layoutBounds: Bounds2, visibleBoundsProperty: TReadOnlyProperty<Bounds2>, tandem: Tandem ) {

    const waterWheelNode = new WaterWheelNode( turbine.barMagnet );

    const barMagnetNode = new BarMagnetNode( turbine.barMagnet, {
      isMovable: false, // This bar magnet cannot be dragged. Its motion is controlled by the turbine.
      tandem: tandem.createTandem( 'barMagnetNode' )
    } );

    const rpmDisplay = new RPMDisplay( turbine.rpmProperty, {
      radius: 0.6 * barMagnetNode.height,
      center: waterWheelNode.center
    } );

    const waterFaucetNode = new WaterFaucetNode( turbine.waterFaucet, {
      right: layoutBounds.left + 225,
      top: layoutBounds.top + 50,
      tandem: tandem.createTandem( 'waterFaucetNode' )
    } );

    const waterNode = new WaterNode( turbine.waterFaucet.flowRatePercentProperty, turbine.waterFaucet.flowRatePercentProperty.range.max,
      visibleBoundsProperty, {
        centerX: waterFaucetNode.x,
        top: waterFaucetNode.y - 2
      } );

    super( {
      children: [ waterWheelNode, barMagnetNode, rpmDisplay, waterNode, waterFaucetNode ],
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    } );

    this.addLinkedElement( turbine );
  }
}

faradaysElectromagneticLab.register( 'TurbineNode', TurbineNode );