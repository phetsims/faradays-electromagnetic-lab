// Copyright 2023-2024, University of Colorado Boulder

/**
 * ACPowerSupplyNode is view of the AC power supply attached to the electromagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import { Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELColors from '../FELColors.js';
import ACPowerSupplyPanel from './ACPowerSupplyPanel.js';

type SelfOptions = EmptySelfOptions;

type ACPowerSupplyNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'visibleProperty'>;

export default class ACPowerSupplyNode extends Node {

  public constructor( providedOptions?: ACPowerSupplyNodeOptions ) {

    const rectangle = new ShadedRectangle( new Bounds2( 0, 0, 120, 50 ), {
      baseColor: FELColors.acPowerSupplyBodyColorProperty,
      cornerRadius: 5
    } );

    const icon = ACPowerSupplyPanel.createIcon();
    icon.center = rectangle.center;

    const options = optionize<ACPowerSupplyNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      children: [ rectangle, icon ]
    }, providedOptions );

    super( options );
  }
}

faradaysElectromagneticLab.register( 'ACPowerSupplyNode', ACPowerSupplyNode );