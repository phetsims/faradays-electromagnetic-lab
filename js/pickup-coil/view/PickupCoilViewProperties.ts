// Copyright 2023, University of Colorado Boulder

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';

/**
 * PickupCoilViewProperties is the set of view-specific Properties for the 'Pickup Coil' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export default class PickupCoilViewProperties {

  public readonly compassVisibleProperty: Property<boolean>;
  public readonly fieldVisibleProperty: Property<boolean>;
  public readonly fieldMeterVisibleProperty: Property<boolean>;
  public readonly pickupCoilElectronsVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    this.compassVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'compassVisibleProperty' ),
      phetioFeatured: true
    } );

    this.fieldVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'fieldVisibleProperty' ),
      phetioFeatured: true
    } );

    this.fieldMeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'fieldMeterVisibleProperty' ),
      phetioFeatured: true
    } );

    this.pickupCoilElectronsVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'pickupCoilElectronsVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.compassVisibleProperty.reset();
    this.fieldVisibleProperty.reset();
    this.fieldMeterVisibleProperty.reset();
    this.pickupCoilElectronsVisibleProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'PickupCoilViewProperties', PickupCoilViewProperties );