// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Coil, { CoilOptions } from './Coil.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Electromagnet from './Electromagnet.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

const WIRE_WIDTH = 16;
const LOOP_SPACING = WIRE_WIDTH; // closely packed loops

type SelfOptions = EmptySelfOptions;

type SourceCoilOptions = SelfOptions &
  StrictOmit<CoilOptions, 'numberOfLoopsRange' | 'loopRadiusRange' | 'wireWidth' | 'loopSpacing'>;

export default class SourceCoil extends Coil {

  private readonly electromagnet: Electromagnet;

  public constructor( electromagnet: Electromagnet, providedOptions: SourceCoilOptions ) {

    const options = optionize<SourceCoilOptions, SelfOptions, CoilOptions>()( {

      // SelfOptions
      //TODO

      // CoilOptions
      numberOfLoopsRange: new RangeWithValue( 1, 4, 4 ),
      loopRadiusRange: new RangeWithValue( 50, 50, 50 ), // fixed radius
      wireWidth: WIRE_WIDTH,
      loopSpacing: LOOP_SPACING
    }, providedOptions );

    super( options );

    this.electromagnet = electromagnet;
    //TODO
  }

  public override reset(): void {
    super.reset();
    //TODO
  }
}

faradaysElectromagneticLab.register( 'SourceCoil', SourceCoil );