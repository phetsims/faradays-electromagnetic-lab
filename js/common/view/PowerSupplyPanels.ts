// Copyright 2024, University of Colorado Boulder

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import DCPowerSupply from '../model/DCPowerSupply.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CurrentSource from '../model/CurrentSource.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';
import ACPowerSupply from '../model/ACPowerSupply.js';
import DCPowerSupplyPanel from './DCPowerSupplyPanel.js';
import ACPowerSupplyPanel from './ACPowerSupplyPanel.js';

/**
 * PowerSupplyPanels is the parent for panels related to power supplies. Only one such panel is visible at a time.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export default class PowerSupplyPanels extends Node {

  public constructor( currentSourceProperty: TReadOnlyProperty<CurrentSource>,
                      dcPowerSupply: DCPowerSupply,
                      acPowerSupply: ACPowerSupply,
                      tandem: Tandem ) {

    const dcPowerSupplyPanel = new DCPowerSupplyPanel( dcPowerSupply, currentSourceProperty,
      tandem.createTandem( 'dcPowerSupplyPanel' ) );

    const acPowerSupplyPanel = new ACPowerSupplyPanel( acPowerSupply, currentSourceProperty,
      tandem.createTandem( 'acPowerSupplyPanel' ) );

    super( {
      children: [ dcPowerSupplyPanel, acPowerSupplyPanel ],
      tandem: tandem,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );
  }
}

faradaysElectromagneticLab.register( 'PowerSupplyPanels', PowerSupplyPanels );