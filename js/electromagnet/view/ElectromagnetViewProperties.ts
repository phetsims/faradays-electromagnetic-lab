// Copyright 2023, University of Colorado Boulder

/**
 * ElectromagnetViewProperties is the set of view-specific Properties for the 'Electromagnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';

export default class ElectromagnetViewProperties {

  public readonly compassVisibleProperty: Property<boolean>;
  public readonly fieldVisibleProperty: Property<boolean>;
  public readonly fieldMeterVisibleProperty: Property<boolean>;
  public readonly electromagnetElectronsVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    this.compassVisibleProperty = new BooleanProperty( false, {
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

    this.electromagnetElectronsVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'electromagnetElectronsVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.compassVisibleProperty.reset();
    this.fieldVisibleProperty.reset();
    this.fieldMeterVisibleProperty.reset();
    this.electromagnetElectronsVisibleProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'ElectromagnetViewProperties', ElectromagnetViewProperties );