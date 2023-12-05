// Copyright 2023, University of Colorado Boulder

/**
 * TransformerViewProperties is the set of view-specific Properties for the 'Transformer' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';

export default class TransformerViewProperties {

  public readonly fieldVisibleProperty: Property<boolean>;
  public readonly electromagnetElectronsVisibleProperty: Property<boolean>;
  public readonly pickupCoilElectronsVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    this.electromagnetElectronsVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'electromagnetElectronsVisibleProperty' ),
      phetioFeatured: true
    } );

    this.pickupCoilElectronsVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'pickupCoilElectronsVisibleProperty' ),
      phetioFeatured: true
    } );

    this.fieldVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'fieldVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.electromagnetElectronsVisibleProperty.reset();
    this.pickupCoilElectronsVisibleProperty.reset();
    this.fieldVisibleProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'TransformerViewProperties', TransformerViewProperties );