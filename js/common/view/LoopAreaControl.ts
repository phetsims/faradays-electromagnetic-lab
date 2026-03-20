// Copyright 2023-2026, University of Colorado Boulder

/**
 * LoopAreaControl controls the area of all loops in a coil. The control shows values in % units.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import PercentControl from './PercentControl.js';

export default class LoopAreaControl extends PercentControl {

  public constructor( loopAreaPercentProperty: NumberProperty, tandem: Tandem ) {

    super( FaradaysElectromagneticLabStrings.loopAreaStringProperty, loopAreaPercentProperty, {
      hasCenterTickMark: false,
      tandem: tandem
    } );
  }
}
