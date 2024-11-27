// Copyright 2023-2024, University of Colorado Boulder

/**
 * FieldMeter is the model of a meter that measures the B-field at a specific position.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { MagneticUnits } from '../FELQueryParameters.js';
import FieldMeasurementTool, { FieldMeasurementToolOptions } from './FieldMeasurementTool.js';
import Magnet from './Magnet.js';

type SelfOptions = EmptySelfOptions;

export type FieldMeterOptions = SelfOptions & FieldMeasurementToolOptions;

export default class FieldMeter extends FieldMeasurementTool {

  public readonly magneticUnitsProperty: TReadOnlyProperty<MagneticUnits>;

  // These are convenience Properties, requested for PhET-iO, private because they should NOT be used elsewhere.
  // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/62#issuecomment-1952874051
  private readonly magnitudeProperty: TReadOnlyProperty<number>;
  private readonly angleProperty: TReadOnlyProperty<number>;

  public constructor( magnet: Magnet, magneticUnitsProperty: TReadOnlyProperty<MagneticUnits>, providedOptions: FieldMeterOptions ) {

    super( magnet, providedOptions );

    this.magneticUnitsProperty = magneticUnitsProperty;

    this.magnitudeProperty = new DerivedProperty( [ this.fieldVectorProperty ],
      fieldVector => fieldVector.magnitude, {
        units: 'G',
        tandem: providedOptions.tandem.createTandem( 'magnitudeProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'Magnitude of the field vector at the meter\'s position.'
      } );

    this.angleProperty = new DerivedProperty( [ this.fieldVectorProperty ],
      fieldVector => fieldVector.angle, {
        units: 'radians',
        tandem: providedOptions.tandem.createTandem( 'angleProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'Angle of the field vector at the meter\'s position.'
      } );
  }
}

faradaysElectromagneticLab.register( 'FieldMeter', FieldMeter );