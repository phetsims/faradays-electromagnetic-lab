// Copyright 2023-2024, University of Colorado Boulder

/**
 * SourceCoil is the model of the source coil for the electromagnet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Coil from './Coil.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

const WIRE_WIDTH = 16;
const LOOP_SPACING = WIRE_WIDTH; // closely-packed loops

export default class SourceCoil extends Coil {

  public constructor( currentAmplitudeProperty: TReadOnlyProperty<number>, tandem: Tandem ) {
    super( currentAmplitudeProperty, {
      numberOfLoopsRange: new RangeWithValue( 1, 4, 4 ),
      loopAreaRange: new RangeWithValue( 7854, 7854, 7854 ), // fixed area
      wireWidth: WIRE_WIDTH,
      loopSpacing: LOOP_SPACING,
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'SourceCoil', SourceCoil );