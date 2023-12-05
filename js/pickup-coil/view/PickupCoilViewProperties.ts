// Copyright 2023, University of Colorado Boulder

/**
 * PickupCoilViewProperties is the set of view-specific Properties for the 'Pickup Coil' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import { Indicator, IndicatorValues } from '../../common/model/Indicator.js';

export default class PickupCoilViewProperties {

  public readonly indicatorProperty: Property<Indicator>;
  public readonly pickupCoilElectronsVisibleProperty: Property<boolean>;
  public readonly fieldVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    this.indicatorProperty = new StringUnionProperty<Indicator>( 'lightBulb', {
      validValues: IndicatorValues,
      tandem: tandem.createTandem( 'indicatorProperty' ),
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
    this.fieldVisibleProperty.reset();
    this.pickupCoilElectronsVisibleProperty.reset();
    this.indicatorProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'PickupCoilViewProperties', PickupCoilViewProperties );