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

export default class PickupCoilViewProperties {

  public readonly fieldVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    this.fieldVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'fieldVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.fieldVisibleProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'PickupCoilViewProperties', PickupCoilViewProperties );