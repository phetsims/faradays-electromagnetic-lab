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

      // Loop area is fixed for a source coil.  In the Java version, loop area was computed from loop radius 50,
      // resulting in Math.PI * 50 * 50 = 7853.981633974483. Here we have rounded to the nearest integer.
      // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/48
      loopAreaRange: new RangeWithValue( 7854, 7854, 7854 ),
      numberOfLoopsRange: new RangeWithValue( 1, 4, 4 ),
      wireWidth: WIRE_WIDTH,
      loopSpacing: LOOP_SPACING,
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'SourceCoil', SourceCoil );