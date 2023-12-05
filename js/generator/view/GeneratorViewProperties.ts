// Copyright 2023, University of Colorado Boulder

/**
 * GeneratorViewProperties is the set of view-specific Properties for the 'Generator' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';

export default class GeneratorViewProperties {

  public readonly pickupCoilElectronsVisibleProperty: Property<boolean>;
  public readonly fieldVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

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
    this.pickupCoilElectronsVisibleProperty.reset();
    this.fieldVisibleProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'GeneratorViewProperties', GeneratorViewProperties );