// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnetViewProperties is the set of view-specific Properties for the 'Bar Magnet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';

export default class BarMagnetViewProperties {

  // Whether the field inside the bar magnet is visible.
  public readonly seeInsideBarMagnetProperty: Property<boolean>;

  // Whether planet Earth is visible, aligned with the bar magnet.
  public readonly earthVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    this.seeInsideBarMagnetProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'seeInsideBarMagnetProperty' ),
      phetioFeatured: true
    } );

    this.earthVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'earthVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.seeInsideBarMagnetProperty.reset();
    this.earthVisibleProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'BarMagnetViewProperties', BarMagnetViewProperties );