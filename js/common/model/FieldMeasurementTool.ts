// Copyright 2023-2024, University of Colorado Boulder

/**
 * FieldMeasurementTool is the base class for tools that measure the B-field at a specific position.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Magnet from './Magnet.js';

type SelfOptions = {
  position?: Vector2; // Initial value of positionProperty, unitless
  visible?: boolean;
};

export type FieldMeasurementToolOptions = SelfOptions &
  PickOptional<PhetioObjectOptions, 'phetioDocumentation'> &
  PickRequired<PhetioObjectOptions, 'tandem'>;

export default class FieldMeasurementTool extends PhetioObject {

  // The tool's position, unitless.
  public readonly positionProperty: Property<Vector2>;

  // The field vector at the tool's position, in gauss.
  public readonly fieldVectorProperty: TReadOnlyProperty<Vector2>;

  // Whether the tool is visible.
  public readonly visibleProperty: Property<boolean>;

  protected constructor( magnet: Magnet, providedOptions: FieldMeasurementToolOptions ) {

    const options = optionize<FieldMeasurementToolOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      visible: true,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false,
      phetioFeatured: true
    }, providedOptions );

    super( options );

    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioFeatured: true
    } );

    // This needs to be a new Vector2 instance, so do not pass an output vector to magnet.getFieldVector.
    this.fieldVectorProperty = new DerivedProperty(
      [ this.positionProperty, magnet.positionProperty, magnet.rotationProperty, magnet.strengthProperty ],
      ( toolPosition, magnetPosition, rotation, strength ) => magnet.getFieldVector( toolPosition ), {
        units: 'G',
        tandem: options.tandem.createTandem( 'fieldVectorProperty' ),
        phetioValueType: Vector2.Vector2IO,
        phetioFeatured: true
      } );

    this.visibleProperty = new BooleanProperty( options.visible, {
      tandem: options.tandem.createTandem( 'visibleProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.positionProperty.reset();
    this.visibleProperty.reset();
  }
}

faradaysElectromagneticLab.register( 'FieldMeasurementTool', FieldMeasurementTool );