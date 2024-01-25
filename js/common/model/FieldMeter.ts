// Copyright 2023-2024, University of Colorado Boulder

/**
 * FieldMeter is the model of a meter for measuring the B-field at a specific position.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Magnet from './Magnet.js';
import FieldMeasurementTool, { FieldMeasurementToolOptions } from './FieldMeasurementTool.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

export type FieldMeterOptions = SelfOptions & FieldMeasurementToolOptions;

export default class FieldMeter extends FieldMeasurementTool {

  public constructor( magnet: Magnet, providedOptions: FieldMeterOptions ) {
    super( magnet, providedOptions );
  }
}

faradaysElectromagneticLab.register( 'FieldMeter', FieldMeter );

