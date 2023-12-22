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

export default class TurbineNode extends Node {

  public constructor( turbine: Turbine, tandem: Tandem ) {

    const barMagnetNode = new BarMagnetNode( turbine, {
      tandem: tandem.createTandem( 'barMagnetNode' ),
      phetioInputEnabledPropertyInstrumented: false
    } );

    super( {
      children: [ barMagnetNode ],
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'TurbineNode', TurbineNode );