// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Circle } from '../../../../scenery/js/imports.js';
import Electromagnet from '../model/Electromagnet.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FELMovableNode from './FELMovableNode.js';

export default class ElectromagnetNode extends FELMovableNode {

  public constructor( electromagnet: Electromagnet, tandem: Tandem ) {

    //TODO flesh out ElectromagnetNode
    const placeholderNode = new Circle( {
      radius: electromagnet.radiusProperty.value,
      fill: 'orange',
      stroke: 'black'
    } );

    super( electromagnet, {
      children: [ placeholderNode ],
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetNode', ElectromagnetNode );