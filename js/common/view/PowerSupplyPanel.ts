// Copyright 2024, University of Colorado Boulder

/**
 * PowerSupplyPanel is the base class for ACPowerSupplyPanel and DCPowerSupplyPanel.  It makes the panel draggable,
 * constrained to some drag bounds.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CurrentSource from '../model/CurrentSource.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import FELConstants from '../FELConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Node } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = {
  position: Vector2; // initial position of the panel
};

export type PowerSupplyPanelOptions = SelfOptions &
  PickRequired<PanelOptions, 'fill' | 'stroke' | 'tandem'>;

export default class PowerSupplyPanel extends Panel {

  // Position of the panel's top left corner.
  private readonly positionProperty: Property<Vector2>;

  public constructor( content: Node, powerSupply: CurrentSource, currentSourceProperty: TReadOnlyProperty<CurrentSource>,
                      providedOptions: PowerSupplyPanelOptions ) {

    const options = optionize4<PowerSupplyPanelOptions, SelfOptions, PanelOptions>()( {}, FELConstants.PANEL_OPTIONS, {
      visibleProperty: new DerivedProperty( [ currentSourceProperty ], currentSource => ( currentSource === powerSupply ) ),
      xMargin: 10,
      yMargin: 5,
      phetioFeatured: true
    }, providedOptions );

    super( content, options );

    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.positionProperty.link( position => {
      this.translation = position;
    } );

    // Interrupt interaction when this Node becomes invisible.
    this.visibleProperty.lazyLink( visible => !visible && this.interruptSubtreeInput() );

    this.addLinkedElement( powerSupply );
  }

  public reset(): void {
    this.positionProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'PowerSupplyPanel', PowerSupplyPanel );