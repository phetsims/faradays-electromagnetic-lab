// Copyright 2023, University of Colorado Boulder

/**
 * FieldMeter is the model of a meter for measuring the B-field at a specific position.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Magnet from './Magnet.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import FELMovable, { FELMovableOptions } from './FELMovable.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

type SelfOptions = {
  visible?: boolean;
};

export type FieldMeterOptions = SelfOptions & FELMovableOptions;

export default class FieldMeter extends FELMovable {

  // The field vector at the meter's position, in gauss
  public readonly fieldVectorProperty: TReadOnlyProperty<Vector2>;

  public readonly visibleProperty: Property<boolean>;

  public constructor( magnet: Magnet, providedOptions: FieldMeterOptions ) {

    const options = optionize<FieldMeterOptions, SelfOptions, FELMovableOptions>()( {

      //SelfOptions
      visible: true
    }, providedOptions );

    super( options );

    // This needs to be a new Vector2 instance, so do not pass an output vector to magnet.getFieldVector.
    this.fieldVectorProperty = new DerivedProperty(
      [ this.positionProperty, magnet.positionProperty, magnet.rotationProperty, magnet.strengthProperty ],
      ( position, rotation, strength ) => magnet.getFieldVector( position ), {
        units: 'G',
        tandem: options.tandem.createTandem( 'fieldVectorProperty' ),
        phetioValueType: Vector2.Vector2IO,
        phetioFeatured: true
      } );

    this.visibleProperty = new BooleanProperty( options.visible, {
      tandem: options.tandem.createTandem( 'visibleProperty' )
    } );
  }

  public override reset(): void {
    super.reset();
    this.visibleProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'FieldMeter', FieldMeter );

