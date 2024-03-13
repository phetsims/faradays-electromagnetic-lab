// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnetStrengthControl is the control for magnet strength. The control shows values in % units.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PercentControl from './PercentControl.js';

export default class BarMagnetStrengthControl extends PercentControl {

  public constructor( strengthPercentProperty: NumberProperty, tandem: Tandem ) {

    super( FaradaysElectromagneticLabStrings.strengthStringProperty, strengthPercentProperty, {
      hasCenterTickMark: true,
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'BarMagnetStrengthControl', BarMagnetStrengthControl );