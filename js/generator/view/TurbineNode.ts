// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Turbine from '../model/Turbine.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BarMagnetNode from '../../common/view/BarMagnetNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import FaucetNode from '../../../../scenery-phet/js/FaucetNode.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

export default class TurbineNode extends Node {

  public constructor( turbine: Turbine, layoutBounds: Bounds2, tandem: Tandem ) {

    const barMagnetNode = new BarMagnetNode( turbine, {
      tandem: tandem.createTandem( 'barMagnetNode' ),
      phetioInputEnabledPropertyInstrumented: false
    } );

    const faucetNode = new FaucetNode( turbine.speedProperty.rangeProperty.value.max, turbine.speedProperty, new Property( true ), {
      scale: 0.65,
      closeOnRelease: false,
      tapToDispenseEnabled: false,
      horizontalPipeLength: 2000,
      right: layoutBounds.left + 225,
      top: layoutBounds.top + 50,
      tandem: tandem.createTandem( 'faucetNode' ),
      phetioVisiblePropertyInstrumented: false
    } );

    super( {
      children: [ barMagnetNode, faucetNode ],
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'TurbineNode', TurbineNode );