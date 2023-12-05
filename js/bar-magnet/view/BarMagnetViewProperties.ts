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

  public readonly seeInsideBarMagnetProperty: Property<boolean>;
  public readonly fieldVisibleProperty: Property<boolean>;
  public readonly earthVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    this.seeInsideBarMagnetProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'seeInsideBarMagnetProperty' ),
      phetioFeatured: true
    } );

    this.fieldVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'fieldVisibleProperty' ),
      phetioFeatured: true
    } );

    this.earthVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'earthVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.seeInsideBarMagnetProperty.reset();
    this.fieldVisibleProperty.reset();
    this.earthVisibleProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'BarMagnetViewProperties', BarMagnetViewProperties );