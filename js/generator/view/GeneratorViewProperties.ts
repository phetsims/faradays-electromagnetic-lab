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
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import { Indicator, IndicatorValues } from '../../common/model/Indicator.js';

export default class GeneratorViewProperties {

  public readonly indicatorProperty: Property<Indicator>;
  public readonly pickupCoilElectronsVisibleProperty: Property<boolean>;
  public readonly fieldVisibleProperty: Property<boolean>;
  public readonly fieldMeterVisibleProperty: Property<boolean>;

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

    this.fieldMeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'fieldMeterVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.indicatorProperty.reset();
    this.pickupCoilElectronsVisibleProperty.reset();
    this.fieldVisibleProperty.reset();
    this.fieldMeterVisibleProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'GeneratorViewProperties', GeneratorViewProperties );