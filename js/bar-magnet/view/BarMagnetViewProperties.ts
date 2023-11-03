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

    this.compassVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'compassVisibleProperty' )
    } );

    this.earthVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'earthVisibleProperty' )
    } );

    this.fieldVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'fieldVisibleProperty' )
    } );

    this.fieldMeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'fieldMeterVisibleProperty' )
    } );

    this.seeInsideBarMagnetProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'seeInsideBarMagnetProperty' )
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