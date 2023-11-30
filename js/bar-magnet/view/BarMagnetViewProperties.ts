// Copyright 2023, University of Colorado Boulder

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';

/**
 * BarMagnetViewProperties is the set of view-specific Properties for the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export default class BarMagnetViewProperties {

  public readonly compassVisibleProperty: Property<boolean>;
  public readonly earthVisibleProperty: Property<boolean>;
  public readonly fieldVisibleProperty: Property<boolean>;
  public readonly fieldMeterVisibleProperty: Property<boolean>;
  public readonly seeInsideBarMagnetProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    this.compassVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'compassVisibleProperty' ),
      phetioFeatured: true
    } );

    this.earthVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'earthVisibleProperty' ),
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

    this.seeInsideBarMagnetProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'seeInsideBarMagnetProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.compassVisibleProperty.reset();
    this.earthVisibleProperty.reset();
    this.fieldVisibleProperty.reset();
    this.fieldMeterVisibleProperty.reset();
    this.seeInsideBarMagnetProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'BarMagnetViewProperties', BarMagnetViewProperties );